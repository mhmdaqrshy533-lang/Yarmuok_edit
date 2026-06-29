import { ArrowRight, Printer, LayoutTemplate, HelpCircle, Zap, Sparkles, X } from "lucide-react";
import { ViewState, Student, MonthGrades } from "../types";
import React, { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../store";
import { playSound } from "../utils/audio";

interface MonthlyResultsProps {
  setView: (view: ViewState) => void;
}

export default function MonthlyResults({ setView }: MonthlyResultsProps) {
  const { students, updateGrade, settings } = useStore();
  const periods = settings.evaluationPeriods || [
    { id: 'month1', name: 'الشهر الأول' },
    { id: 'month2', name: 'الشهر الثاني' },
    { id: 'month3', name: 'الشهر الثالث' }
  ];

  const [activeTab, setActiveTab] = useState<string>(periods[0]?.id || "month1");
  const [template, setTemplate] = useState<"default" | "saudi_tracking">("default");
  
  const [editingCell, setEditingCell] = useState<{
    studentId: string;
    field: keyof MonthGrades;
  } | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const componentRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);

  const [sortField, setSortField] = useState<"name" | "total" | "final" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `محصلات_${periods.find(p => p.id === activeTab)?.name || "الدراسية"}`,
  });

  const handleCellClick = (
    studentId: string,
    field: keyof MonthGrades,
    currentValue: number | null,
  ) => {
    setEditingCell({ studentId, field });
    setEditValue(currentValue !== null ? currentValue.toString() : "");
  };

  const handleBlur = () => {
    if (editingCell) {
      let numValue = editValue === "" ? null : parseInt(editValue, 10);
      const maxLimit = settings.maxPoints?.[editingCell.field as keyof typeof settings.maxPoints] || 20;
      
      if (numValue !== null && !isNaN(numValue)) {
        if (numValue > maxLimit) {
          playSound('error');
          numValue = maxLimit; // Autoclamp to prevent validation errors
        } else if (numValue < 0) {
          playSound('error');
          numValue = 0;
        } else {
          playSound('success');
        }
      }

      updateGrade(
        editingCell.studentId,
        activeTab,
        editingCell.field,
        isNaN(numValue as any) ? null : numValue,
      );
    }
    // We do NOT clear editingCell instantly on blur if we want the teacher to use the predictive floating bar below!
    // But wait, if they click outside, they might want to use the buttons.
    // Let's keep a reference to the active/last edited field and value so they can run bulk actions!
  };

  // We will keep a separate state for the last active field and value to enable bulk autofill actions
  const [lastActiveField, setLastActiveField] = useState<keyof MonthGrades | null>(null);
  const [lastActiveValue, setLastActiveValue] = useState<number | null>(null);

  const handleCellFocus = (field: keyof MonthGrades, value: number | null) => {
    setLastActiveField(field);
    setLastActiveValue(value);
  };

  const handleFillAll = () => {
    if (!lastActiveField || lastActiveValue === null) return;
    students.forEach(student => {
      updateGrade(student.id, activeTab, lastActiveField, lastActiveValue);
    });
    alert(`⚡ تم تعبئة الدرجة (${lastActiveValue}) لجميع الطلاب في عمود (${lastActiveField}) لشهر ${activePeriodName} بنجاح.`);
  };

  const handleFillEmpty = () => {
    if (!lastActiveField || lastActiveValue === null) return;
    let count = 0;
    students.forEach(student => {
      const grades = student.grades?.[activeTab];
      const currentVal = grades ? grades[lastActiveField] : null;
      if (currentVal === undefined || currentVal === null) {
        updateGrade(student.id, activeTab, lastActiveField, lastActiveValue);
        count++;
      }
    });
    alert(`⚡ تم تعبئة الدرجة (${lastActiveValue}) لعدد (${count}) من الطلاب في عمود (${lastActiveField}) بنجاح.`);
  };

  const handleSmartSimulate = () => {
    if (!lastActiveField) return;
    const maxLimit = settings.maxPoints?.[lastActiveField as keyof typeof settings.maxPoints] || 20;
    students.forEach(student => {
      const randomGrade = Math.floor(maxLimit * (0.75 + Math.random() * 0.25));
      updateGrade(student.id, activeTab, lastActiveField, randomGrade);
    });
    alert(`🎲 تم توليد درجات محاكاة ذكية (بين 75% و 100%) لجميع الطلاب في عمود (${lastActiveField}).`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur();
      setEditingCell(null);
    }
  };

  const calculateTotal = (grades?: MonthGrades) => {
    if (!grades) return 0;
    return (
      (grades.homework || 0) +
      (grades.attendance || 0) +
      (grades.oral || 0) +
      (grades.written || 0)
    );
  };

  const calculateFinal = (total: number) => {
    return Math.round(total / 5); // Default Yemeni calculation (out of 20 marks)
  };

  const handleSort = (field: "name" | "total" | "final") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedStudents = [...students].sort((a, b) => {
    if (!sortField) return 0;

    if (sortField === "name") {
      return sortDirection === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }

    const gradesA = a.grades?.[activeTab];
    const gradesB = b.grades?.[activeTab];
    const totalA = calculateTotal(gradesA);
    const totalB = calculateTotal(gradesB);

    if (sortField === "total") {
      return sortDirection === "asc" ? totalA - totalB : totalB - totalA;
    }

    if (sortField === "final") {
      return sortDirection === "asc"
        ? calculateFinal(totalA) - calculateFinal(totalB)
        : calculateFinal(totalB) - calculateFinal(totalA);
    }

    return 0;
  });

  const activePeriodName = periods.find(p => p.id === activeTab)?.name || "الفترة الحالية";

  return (
    <div className="flex flex-col h-full bg-[#121619] relative text-gray-200 font-sans">
      {/* Header */}
      <div className="bg-[#0f291e] text-white flex items-center justify-between p-4 shadow-[0_4px_30px_rgba(16,185,129,0.1)] z-10 sticky top-0 border-b border-emerald-900/50 print:hidden">
        <button
          onClick={() => setView("home")}
          className="p-2 rounded-xl hover:bg-emerald-950/40 transition-colors group"
        >
          <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
        </button>
        <div className="text-center flex-1">
          <h1 className="font-bold text-lg text-emerald-400">
            كشوفات محصلات الطلاب وأعمال السنة
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <LayoutTemplate className="w-5 h-5 text-emerald-400" />
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value as any)}
              className="bg-black/50 border border-emerald-900/30 rounded-xl px-4 py-2 text-white font-bold focus:outline-none focus:border-emerald-500/50 appearance-none hover:bg-emerald-950/40 transition-colors"
            >
              <option value="default">كشف المحصلات (الافتراضي)</option>
              <option value="saudi_tracking">كشف متابعة الطلاب (السعودية)</option>
            </select>
          </div>
          <div className="h-6 w-px bg-emerald-900/30 mx-2 hidden md:block"></div>
          <div
            className="flex items-center gap-2 bg-black/50 border border-emerald-900/30 rounded-xl p-1"
            dir="ltr"
          >
            <button
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
              className="px-2 py-0.5 hover:bg-emerald-950/40 rounded-lg text-emerald-400 hover:text-emerald-300 font-bold text-sm"
            >
              -
            </button>
            <span className="text-xs font-mono w-10 text-center text-emerald-300">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
              className="px-2 py-0.5 hover:bg-emerald-950/40 rounded-lg text-emerald-400 hover:text-emerald-300 font-bold text-sm"
            >
              +
            </button>
          </div>
          <button
            onClick={() => handlePrint()}
            className="p-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/30 transition-colors shadow-md border border-emerald-900/40 group"
            title="طباعة الكشف الحالي"
          >
            <Printer className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col w-full mx-auto overflow-hidden p-2 md:p-6 print:max-w-full print:p-0">
        {/* Helper Banner */}
        <div className="max-w-6xl w-full mx-auto mb-3 bg-[#17251e] border border-emerald-900/30 rounded-xl p-3 text-xs text-emerald-400 flex items-center gap-2 print:hidden">
          <HelpCircle className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>تلميح برامجي: لتعديل درجة أي طالب فوراً، انقر فوق الخلية واكتب الدرجة واضغط Enter للحفظ المباشر.</span>
        </div>

        {/* Tabs */}
        {template === "default" && (
          <div className="flex max-w-6xl mx-auto w-full bg-[#171c1f]/80 backdrop-blur-xl border-b border-emerald-900/30 text-sm font-bold print:hidden shadow-lg z-10 rounded-t-2xl overflow-hidden">
            {periods.map((period) => (
              <button
                key={period.id}
                onClick={() => setActiveTab(period.id)}
                className={`flex-1 py-4 text-center transition-all relative ${
                  activeTab === period.id
                    ? "text-emerald-400 bg-emerald-950/20 font-extrabold"
                    : "text-gray-500 hover:bg-white/5 hover:text-gray-300"
                }`}
              >
                {period.name}
                {activeTab === period.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-400 rounded-t-md mx-6 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Table Area */}
        <div className="flex-1 overflow-auto bg-[#121619] border-t border-emerald-900/20 print:bg-white print:border-none">
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
              transition: "transform 0.2s ease-out",
            }}
            className="pb-32 print:pb-0 relative"
          >
            {/* Watermark */}
            {settings.showWatermark && (
              <div className="hidden print:flex absolute inset-0 items-center justify-center pointer-events-none z-0 opacity-[0.03]">
                <h1 className="text-[120px] font-black -rotate-45 text-black">ΣIGMA ACADEMY</h1>
              </div>
            )}
            <div
              ref={componentRef}
              className={`bg-[#171c20] mb-4 shadow-[0_0_30px_rgba(16,185,129,0.05)] border border-emerald-900/20 print:bg-transparent print:text-black print:overflow-visible print:m-0 print:border-none print:shadow-none mx-auto relative z-10 ${template === "default" ? "max-w-6xl rounded-b-2xl" : "max-w-[1000px] bg-white p-4"}`}
            >
              {template === "default" ? (
                <>
                  <div className="hidden print:block text-center mb-6 pt-8 border-b-2 border-black pb-4">
                    <h1 className="font-bold text-2xl text-black mb-2">
                      {settings.schoolName}
                    </h1>
                    <p className="text-lg text-gray-700 font-bold">
                      كشف درجات أعمال السنة والأنشطة لشهر: {activePeriodName}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">العام الدراسي: {settings.year}</p>
                  </div>
                  <table className="w-full text-xs print:text-[10px] text-center border-collapse table-fixed">
                    <thead className="bg-[#0f1416] sticky top-0 z-10 shadow-sm text-gray-300 print:static print:bg-gray-100 print:text-black">
                      <tr>
                        <th className="py-3 px-1 border-b border-l border-emerald-950/40 print:border-gray-300 w-10">
                          م
                        </th>
                        <th
                          className="py-3 px-4 border-b border-l border-emerald-950/40 print:border-gray-300 text-right cursor-pointer hover:bg-white/5 transition-colors truncate"
                          onClick={() => handleSort("name")}
                        >
                          إسم الطالب رباعياً{" "}
                          {sortField === "name" &&
                            (sortDirection === "asc" ? "↑" : "↓")}
                        </th>
                        <th className="py-2 px-1 border-b border-l border-emerald-950/40 print:border-gray-300 w-10">
                          <div className="-rotate-90 whitespace-nowrap h-16 flex items-center justify-center">
                            الواجبات
                          </div>
                        </th>
                        <th className="py-2 px-1 border-b border-l border-emerald-950/40 print:border-gray-300 w-10">
                          <div className="-rotate-90 whitespace-nowrap h-16 flex items-center justify-center">
                            المواظبة
                          </div>
                        </th>
                        <th className="py-2 px-1 border-b border-l border-emerald-950/40 print:border-gray-300 w-10">
                          <div className="-rotate-90 whitespace-nowrap h-16 flex items-center justify-center">
                            الشفهي
                          </div>
                        </th>
                        <th className="py-2 px-1 border-b border-l border-emerald-950/40 print:border-gray-300 w-10">
                          <div className="-rotate-90 whitespace-nowrap h-16 flex items-center justify-center">
                            التحريري
                          </div>
                        </th>
                        <th
                          className="py-2 px-1 border-b border-l border-emerald-950/40 print:border-gray-300 w-12 bg-emerald-950/30 print:bg-emerald-50 font-bold cursor-pointer hover:bg-emerald-900/40 transition-colors"
                          onClick={() => handleSort("total")}
                        >
                          <div className="-rotate-90 whitespace-nowrap h-16 flex items-center justify-center">
                            المجموع{" "}
                            {sortField === "total" &&
                              (sortDirection === "asc" ? "↑" : "↓")}
                          </div>
                        </th>
                        <th
                          className="py-2 px-1 border-b border-emerald-950/40 print:border-gray-300 w-12 bg-[#0d2a1d] print:bg-teal-50 font-bold cursor-pointer hover:bg-[#113a28] transition-colors"
                          onClick={() => handleSort("final")}
                        >
                          <div className="-rotate-90 whitespace-nowrap h-16 flex items-center justify-center">
                            المحصلة{" "}
                            {sortField === "final" &&
                              (sortDirection === "asc" ? "↑" : "↓")}
                          </div>
                        </th>
                        <th className="py-2 px-1 border-b border-emerald-950/40 print:border-gray-300 w-24 bg-[#161d21] print:hidden font-bold">
                          <div className="whitespace-nowrap flex items-center justify-center">
                            منحنى التقدم
                          </div>
                        </th>
                      </tr>
                      <tr className="bg-[#0f1416]/80 font-bold text-gray-400 border-b-2 border-emerald-900/30 print:bg-white print:text-gray-500 print:border-gray-300">
                        <th className="py-1 border-l border-emerald-950/40 print:border-gray-300"></th>
                        <th className="py-1 border-l border-emerald-950/40 print:border-gray-300"></th>
                        <th className="py-1 border-l border-emerald-950/40 print:border-gray-300">
                          {settings.maxPoints?.homework || 20}
                        </th>
                        <th className="py-1 border-l border-emerald-950/40 print:border-gray-300">
                          {settings.maxPoints?.attendance || 20}
                        </th>
                        <th className="py-1 border-l border-emerald-950/40 print:border-gray-300">
                          {settings.maxPoints?.oral || 20}
                        </th>
                        <th className="py-1 border-l border-emerald-950/40 print:border-gray-300">
                          {settings.maxPoints?.written || 40}
                        </th>
                        <th className="py-1 border-l border-emerald-950/40 print:border-gray-300 bg-emerald-950/30 print:bg-emerald-50">
                          100
                        </th>
                        <th className="py-1 bg-[#0d2a1d] print:bg-teal-50">
                           20
                         </th>
                         <th className="py-1 border-emerald-950/40 bg-[#161d21] print:hidden"></th>
                       </tr>
                     </thead>
                     <tbody>
                       {sortedStudents.map((student, idx) => {
                         const grades = student.grades?.[activeTab];
                         const total = calculateTotal(grades);
                         const final = calculateFinal(total);
                         const renderCell = (
                          field: keyof MonthGrades,
                          value: number | null,
                        ) => {
                          const isEditing =
                            editingCell?.studentId === student.id &&
                            editingCell?.field === field;
                          const maxLimit = settings.maxPoints?.[field as keyof typeof settings.maxPoints] || 20;

                          if (isEditing) {
                            const numEditVal = Number(editValue);
                            const isOver = numEditVal > maxLimit;
                            return (
                              <div className="relative">
                                <input
                                  type="number"
                                  autoFocus
                                  value={editValue}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setEditValue(val);
                                    handleCellFocus(field, val === "" ? null : parseInt(val, 10));
                                  }}
                                  onBlur={handleBlur}
                                  onKeyDown={handleKeyDown}
                                  className={`w-full text-center bg-[#1d262b] focus:outline-none focus:ring-1 font-extrabold transition-all ${isOver ? 'text-rose-400 ring-rose-500 bg-rose-950/30' : 'text-emerald-400 ring-emerald-400'}`}
                                />
                                {isOver && (
                                  <div className="absolute right-0 top-0 text-[9px] bg-rose-900 text-rose-100 px-1 rounded -mt-7 z-20 whitespace-nowrap border border-rose-600 font-bold shadow-lg shadow-black/50">
                                    تجاوز الحد الأقصى ({maxLimit})!
                                  </div>
                                )}
                              </div>
                            );
                          }
                          return (
                            <div
                              onClick={() => {
                                handleCellClick(student.id, field, value);
                                handleCellFocus(field, value);
                              }}
                              className="w-full h-full cursor-pointer hover:bg-emerald-950/40 min-h-[20px] text-gray-300 print:text-black transition-colors py-1.5 font-bold"
                            >
                              {value === null ? "−" : value}
                            </div>
                          );
                                                   };

                         return (
                          <tr
                            key={student.id}
                            className={`border-b border-emerald-950/20 hover:bg-emerald-950/10 print:border-gray-200 print:hover:bg-transparent ${idx % 2 === 0 ? "bg-transparent" : "bg-black/10"}`}
                          >
                            <td className="py-2 px-1 border-l border-emerald-950/20 font-bold text-gray-500 print:border-gray-200">
                              {idx + 1}
                            </td>
                            <td className="py-2 px-2 border-l border-emerald-950/20 text-right font-medium text-gray-200 print:text-black print:border-gray-200 truncate max-w-[150px]" title={student.name}>
                              {student.name}
                            </td>
                            <td className="py-2 px-1 border-l border-emerald-950/20 print:border-gray-200">
                              {renderCell("homework", grades?.homework ?? null)}
                            </td>
                            <td className="py-2 px-1 border-l border-emerald-950/20 print:border-gray-200">
                              {renderCell("attendance", grades?.attendance ?? null)}
                            </td>
                            <td className="py-2 px-1 border-l border-emerald-950/20 print:border-gray-200">
                              {renderCell("oral", grades?.oral ?? null)}
                            </td>
                            <td className="py-2 px-1 border-l border-emerald-950/20 print:border-gray-200">
                              {renderCell("written", grades?.written ?? null)}
                            </td>
                            <td className="py-2 px-1 border-l border-emerald-950/20 print:border-gray-200 bg-emerald-950/20 print:bg-emerald-50/30 font-bold text-emerald-400 print:text-black">
                              {total}
                            </td>
                            <td className="py-2 px-1 border-l border-emerald-950/20 bg-[#0d2a1d]/20 print:bg-teal-50/30 font-bold text-emerald-400 print:text-black">
                              {final}
                            </td>
                            <td className="py-1 px-1 bg-[#161d21]/30 print:hidden text-center align-middle">
                              {(() => {
                                // Draw dynamic progress sparks across all defined periods
                                const scoreData = periods.map(p => calculateTotal(student.grades?.[p.id]));
                                const maxVal = Math.max(...scoreData, 1);
                                const firstScore = scoreData[0] || 0;
                                const lastScore = scoreData[scoreData.length - 1] || 0;
                                const diff = lastScore - firstScore;
                                const isUp = diff > 0;
                                const isDown = diff < 0;
                                
                                return (
                                  <div className="flex items-center justify-center w-full h-full gap-2">
                                    <div className="w-16 h-6 flex items-end justify-between px-1 gap-[2px]">
                                      {scoreData.map((val, i) => (
                                        <div key={i} className="w-full bg-gray-800/80 rounded-t-sm h-full flex flex-col justify-end" title={`${periods[i]?.name || ''}: ${val}`}>
                                           <div 
                                             className={`w-full rounded-t-sm transition-all ${isUp ? 'bg-emerald-500' : isDown ? 'bg-rose-500' : 'bg-gray-400'}`} 
                                             style={{ height: `${Math.min(100, Math.max(5, (val / 100) * 100))}%` }}
                                           ></div>
                                        </div>
                                      ))}
                                    </div>
                                    <span className={`text-[10px] font-bold ${isUp ? 'text-emerald-400' : isDown ? 'text-rose-400' : 'text-gray-400'}`}>
                                      {isUp ? '↑' : isDown ? '↓' : '−'}
                                    </span>
                                  </div>
                                )
                              })()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </>
              ) : (
                /* Saudi template */
                <div className="font-serif border-[3px] border-black p-2 min-w-[800px] h-full" dir="rtl">
                  <div className="flex justify-between items-center mb-4 text-black">
                    <div className="flex items-center gap-4">
                      <div className="text-center font-bold text-xs border border-black p-2">
                        <p>المملكة العربية السعودية</p>
                        <p>وزارة التعليم</p>
                        <p>الإدارة العامة للتعليم بمحافظة جدة</p>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div className="bg-emerald-800 text-white font-bold px-8 py-2 rounded-full text-xl border-4 border-white shadow-md relative z-10">
                        كشف متابعة درجات الطلاب اليومي والشهري
                      </div>
                      <div className="w-full flex justify-between items-center px-8 text-sm font-bold text-emerald-950 mt-2">
                        <div>
                          المادة / المقرر:{" "}
                          <span className="border-b border-black inline-block w-32" contentEditable suppressContentEditableWarning></span>
                        </div>
                        <div>
                          الشعبة / الصف:{" "}
                          <span className="border-b border-black inline-block w-32" contentEditable suppressContentEditableWarning></span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1 font-bold">
                      <div className="text-emerald-800 font-bold flex items-center gap-1">
                        <span className="text-xs font-mono">VISION</span>
                        <span className="text-xl">2030</span>
                      </div>
                    </div>
                  </div>

                  <table className="border-collapse border border-black w-full text-center text-[10px] font-bold mt-4 text-black">
                    <thead>
                      <tr className="bg-emerald-800 text-white">
                        <th className="border border-black p-2 w-10 text-center" rowSpan={3}>م</th>
                        <th className="border border-black p-2 w-48 text-center" rowSpan={3}>اسم الطالب</th>
                        <th className="border border-black p-1 text-center" colSpan={3}>المهام الأدائية والمشاركة والتفاعل 40 درجة</th>
                        <th className="border border-black p-1 text-center" rowSpan={2}>تقويمات</th>
                        <th className="border border-black p-1 w-12 text-center" rowSpan={3}>الاختبار النهائي<br />40 درجة</th>
                        <th className="border border-black p-1 w-12 text-center" rowSpan={3}>المجموع<br />100 درجة</th>
                      </tr>
                      <tr className="bg-emerald-800 text-white">
                        <th className="border border-black p-1 text-center">المشاركة<br />10 درجات</th>
                        <th className="border border-black p-1 text-center">المهام الأدائية<br />20 درجة</th>
                        <th className="border border-black p-1 text-center">الواجبات<br />10 درجات</th>
                      </tr>
                      <tr className="bg-emerald-100/50 text-black">
                        <th className="border border-black p-0 h-6">
                          <div className="flex h-full w-full">
                            {[...Array(4)].map((_, i) => (
                              <div key={i} className="flex-1 border-l border-black last:border-l-0" contentEditable suppressContentEditableWarning></div>
                            ))}
                          </div>
                        </th>
                        <th className="border border-black p-0 h-6">
                          <div className="flex h-full w-full">
                            {[...Array(4)].map((_, i) => (
                              <div key={i} className="flex-1 border-l border-black last:border-l-0" contentEditable suppressContentEditableWarning></div>
                            ))}
                          </div>
                        </th>
                        <th className="border border-black p-0 h-6">
                          <div className="flex h-full w-full">
                            {[...Array(4)].map((_, i) => (
                              <div key={i} className="flex-1 border-l border-black last:border-l-0" contentEditable suppressContentEditableWarning></div>
                            ))}
                          </div>
                        </th>
                        <th className="border border-black p-0 h-6 bg-emerald-800 text-white font-normal">20 درجة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student, idx) => (
                        <tr key={`saudi-${student.id}`} className="bg-white text-black">
                          <td className="border border-black p-1 bg-emerald-50/50">{idx + 1}</td>
                          <td className="border border-black p-1 text-right pr-2 font-medium">{student.name}</td>
                          <td className="border border-black p-0">
                            <div className="flex h-full w-full min-h-[24px]">
                              {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex-1 border-l border-black last:border-l-0" contentEditable suppressContentEditableWarning></div>
                              ))}
                            </div>
                          </td>
                          <td className="border border-black p-0 bg-emerald-50/30">
                            <div className="flex h-full w-full min-h-[24px]">
                              {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex-1 border-l border-black last:border-l-0" contentEditable suppressContentEditableWarning></div>
                              ))}
                            </div>
                          </td>
                          <td className="border border-black p-0">
                            <div className="flex h-full w-full min-h-[24px]">
                              {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex-1 border-l border-black last:border-l-0" contentEditable suppressContentEditableWarning></div>
                              ))}
                            </div>
                          </td>
                          <td className="border border-black p-1 bg-emerald-50/50" contentEditable suppressContentEditableWarning></td>
                          <td className="border border-black p-1" contentEditable suppressContentEditableWarning></td>
                          <td className="border border-black p-1 bg-emerald-800/10 font-bold text-center" contentEditable suppressContentEditableWarning></td>
                        </tr>
                      ))}
                      {[...Array(Math.max(0, 15 - students.length))].map((_, idx) => (
                        <tr key={`saudi-empty-${idx}`} className="bg-white text-black">
                          <td className="border border-black p-1 bg-emerald-50/50 text-transparent">0</td>
                          <td className="border border-black p-1 text-right pr-2" contentEditable suppressContentEditableWarning></td>
                          <td className="border border-black p-0">
                            <div className="flex h-full w-full min-h-[24px]">
                              {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex-1 border-l border-black last:border-l-0" contentEditable suppressContentEditableWarning></div>
                              ))}
                            </div>
                          </td>
                          <td className="border border-black p-0 bg-emerald-50/30">
                            <div className="flex h-full w-full min-h-[24px]">
                              {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex-1 border-l border-black last:border-l-0" contentEditable suppressContentEditableWarning></div>
                              ))}
                            </div>
                          </td>
                          <td className="border border-black p-0">
                            <div className="flex h-full w-full min-h-[24px]">
                              {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex-1 border-l border-black last:border-l-0" contentEditable suppressContentEditableWarning></div>
                              ))}
                            </div>
                          </td>
                          <td className="border border-black p-1 bg-emerald-50/50" contentEditable suppressContentEditableWarning></td>
                          <td className="border border-black p-1" contentEditable suppressContentEditableWarning></td>
                          <td className="border border-black p-1 bg-emerald-800/10" contentEditable suppressContentEditableWarning></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="bg-emerald-800 text-white text-left p-1 mt-2 text-[10px]">
                    صفحة رقم 1
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Predictive Control Bar */}
      {lastActiveField && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0c2419] border border-emerald-500/40 rounded-2xl px-6 py-4 shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom-5 duration-300 print:hidden text-right" dir="rtl">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
              التحكم الذكي بالعمود النشط
            </span>
            <span className="text-xs text-white font-extrabold">
              عمود: {lastActiveField === 'homework' ? 'الواجبات' : lastActiveField === 'attendance' ? 'المواظبة' : lastActiveField === 'oral' ? 'الشفهي' : 'التحريري'}
              {lastActiveValue !== null && ` | القيمة المحددة: ${lastActiveValue}`}
            </span>
          </div>

          <div className="h-8 w-px bg-emerald-800/40"></div>

          <div className="flex items-center gap-2">
            {lastActiveValue !== null && (
              <>
                <button
                  onClick={handleFillAll}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 px-3 rounded-xl transition-colors flex items-center gap-1.5 shadow-md border border-emerald-400/20"
                >
                  <Zap className="w-3.5 h-3.5" />
                  تعبئة الكل بـ ({lastActiveValue})
                </button>

                <button
                  onClick={handleFillEmpty}
                  className="bg-[#1b3d2b] hover:bg-[#25523a] text-emerald-300 text-xs font-bold py-2 px-3 rounded-xl transition-colors flex items-center gap-1.5 border border-emerald-700/30"
                >
                  تعبئة الفراغات بـ ({lastActiveValue})
                </button>
              </>
            )}

            <button
              onClick={handleSmartSimulate}
              className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-400 text-xs font-bold py-2 px-3 rounded-xl transition-colors flex items-center gap-1.5 border border-emerald-800/50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              محاكاة ذكية (🎲 تلقائي)
            </button>

            <button
              onClick={() => {
                setLastActiveField(null);
                setLastActiveValue(null);
              }}
              className="p-2 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"
              title="إغلاق شريط الأدوات"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
