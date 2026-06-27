import { ArrowRight, Printer, LayoutTemplate } from "lucide-react";
import { ViewState, Student, MonthGrades } from "../types";
import React, { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../store";

interface MonthlyResultsProps {
  setView: (view: ViewState) => void;
}

export default function MonthlyResults({ setView }: MonthlyResultsProps) {
  const { students, updateGrade } = useStore();
  const [activeTab, setActiveTab] = useState<"month1" | "month2" | "month3">(
    "month1",
  );
  const [template, setTemplate] = useState<"default" | "saudi_tracking">(
    "default",
  );
  const [editingCell, setEditingCell] = useState<{
    studentId: string;
    field: keyof MonthGrades;
  } | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const componentRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);

  const [sortField, setSortField] = useState<"name" | "total" | "final" | null>(
    null,
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "محصلات_شهرية",
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
      const numValue = editValue === "" ? null : parseInt(editValue, 10);
      updateGrade(
        editingCell.studentId,
        activeTab,
        editingCell.field,
        isNaN(numValue as any) ? null : numValue,
      );
    }
    setEditingCell(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur();
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
    return Math.round(total / 5); // Example calculation
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

  return (
    <div className="flex flex-col h-full bg-black relative text-gray-200">
      {/* Header */}
      <div className="bg-gray-900/90 backdrop-blur-xl text-white flex items-center justify-between p-4 shadow-[0_4px_30px_rgba(147,51,234,0.15)] z-10 sticky top-0 border-b border-purple-500/20 print:hidden">
        <button
          onClick={() => setView("home")}
          className="p-2 rounded-xl hover:bg-white/10 transition-colors group"
        >
          <ArrowRight className="w-5 h-5 text-purple-400 group-hover:text-cyan-400" />
        </button>
        <div className="text-center flex-1">
          <h1 className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            محصلات الشهور
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <LayoutTemplate className="w-5 h-5 text-purple-400" />
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value as any)}
              className="bg-black/50 border border-purple-500/30 rounded-xl px-4 py-2 text-white font-bold focus:outline-none focus:border-cyan-500/50 appearance-none hover:bg-purple-900/40 transition-colors"
            >
              <option value="default">كشف المحصلات (الافتراضي)</option>
              <option value="saudi_tracking">
                كشف متابعة الطلاب (السعودية)
              </option>
            </select>
          </div>
          <div className="h-6 w-px bg-purple-500/30 mx-2 hidden md:block"></div>
          <div
            className="flex items-center gap-2 bg-black/50 border border-purple-500/30 rounded-xl p-1"
            dir="ltr"
          >
            <button
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
              className="p-1 hover:bg-purple-900/40 rounded-lg text-purple-400 hover:text-cyan-400 font-bold"
            >
              -
            </button>
            <span className="text-xs font-mono w-10 text-center text-cyan-300">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
              className="p-1 hover:bg-purple-900/40 rounded-lg text-purple-400 hover:text-cyan-400 font-bold"
            >
              +
            </button>
          </div>
          <button
            onClick={() => handlePrint()}
            className="p-2 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 transition-colors shadow-md border border-purple-500/30 group"
          >
            <Printer className="w-5 h-5 text-cyan-400 group-hover:text-purple-300" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col w-full mx-auto overflow-hidden p-2 md:p-6 print:max-w-full print:p-0">
        {/* Tabs */}
        {template === "default" && (
          <div className="flex max-w-6xl mx-auto w-full bg-gray-900/80 backdrop-blur-xl border-b border-purple-500/30 text-sm font-bold print:hidden shadow-lg z-10 rounded-t-2xl overflow-hidden">
            {(["month1", "month2", "month3"] as const).map((tab, idx) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-center transition-all relative ${
                  activeTab === tab
                    ? "text-cyan-400 bg-purple-900/30"
                    : "text-gray-500 hover:bg-white/5 hover:text-gray-300"
                }`}
              >
                {idx === 0
                  ? "الشهر الأول"
                  : idx === 1
                    ? "الشهر الثاني"
                    : "الشهر الثالث"}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-400 rounded-t-md mx-6 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Table Area */}
        <div className="flex-1 overflow-auto bg-black border-t border-purple-500/20 print:bg-white print:border-none">
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
              transition: "transform 0.2s ease-out",
            }}
            className="pb-32 print:pb-0 relative"
          >
            {/* Watermark */}
            <div className="hidden print:flex absolute inset-0 items-center justify-center pointer-events-none z-0 opacity-[0.03]">
               <h1 className="text-[150px] font-black -rotate-45 text-black">نظام يرموك</h1>
            </div>
            <div
              ref={componentRef}
              className={`bg-gray-900/60 backdrop-blur-xl mb-4 shadow-[0_0_30px_rgba(147,51,234,0.1)] border border-purple-500/20 print:bg-transparent print:text-black print:overflow-visible print:m-0 print:border-none print:shadow-none mx-auto relative z-10 ${template === "default" ? "max-w-6xl rounded-b-2xl" : "max-w-[1000px] bg-white p-4"}`}
            >
              {template === "default" ? (
                <>
                  <div className="hidden print:block text-center mb-6 pt-8 border-b-2 border-black pb-4">
                    <h1 className="font-bold text-2xl text-black mb-2">
                      كشف درجات أعمال السنة
                    </h1>
                    <p className="text-lg text-gray-700 font-bold">
                      {activeTab === "month1"
                        ? "الشهر الأول"
                        : activeTab === "month2"
                          ? "الشهر الثاني"
                          : "الشهر الثالث"}
                    </p>
                  </div>
                  <table className="w-full text-xs text-center border-collapse">
                    <thead className="bg-black/50 backdrop-blur-md sticky top-0 z-10 shadow-sm text-gray-300 print:static print:bg-gray-100 print:text-black">
                      <tr>
                        <th className="py-3 px-1 border-b border-l border-gray-700/50 print:border-gray-300 w-10">
                          م
                        </th>
                        <th
                          className="py-3 px-4 border-b border-l border-gray-700/50 print:border-gray-300 text-right cursor-pointer hover:bg-white/5 transition-colors"
                          onClick={() => handleSort("name")}
                        >
                          إسم الطالب رباعيا{" "}
                          {sortField === "name" &&
                            (sortDirection === "asc" ? "↑" : "↓")}
                        </th>
                        <th className="py-2 px-1 border-b border-l border-gray-700/50 print:border-gray-300 w-10">
                          <div className="-rotate-90 whitespace-nowrap h-16 flex items-center justify-center">
                            الواجبات
                          </div>
                        </th>
                        <th className="py-2 px-1 border-b border-l border-gray-700/50 print:border-gray-300 w-10">
                          <div className="-rotate-90 whitespace-nowrap h-16 flex items-center justify-center">
                            المواظبة
                          </div>
                        </th>
                        <th className="py-2 px-1 border-b border-l border-gray-700/50 print:border-gray-300 w-10">
                          <div className="-rotate-90 whitespace-nowrap h-16 flex items-center justify-center">
                            الشفهي
                          </div>
                        </th>
                        <th className="py-2 px-1 border-b border-l border-gray-700/50 print:border-gray-300 w-10">
                          <div className="-rotate-90 whitespace-nowrap h-16 flex items-center justify-center">
                            التحريري
                          </div>
                        </th>
                        <th
                          className="py-2 px-1 border-b border-l border-gray-700/50 print:border-gray-300 w-10 bg-purple-900/30 print:bg-blue-50 font-bold cursor-pointer hover:bg-purple-800/40 transition-colors"
                          onClick={() => handleSort("total")}
                        >
                          <div className="-rotate-90 whitespace-nowrap h-16 flex items-center justify-center">
                            المجموع{" "}
                            {sortField === "total" &&
                              (sortDirection === "asc" ? "↑" : "↓")}
                          </div>
                        </th>
                        <th
                          className="py-2 px-1 border-b border-gray-700/50 print:border-gray-300 w-10 bg-cyan-900/30 print:bg-red-50 font-bold cursor-pointer hover:bg-cyan-800/40 transition-colors"
                          onClick={() => handleSort("final")}
                        >
                          <div className="-rotate-90 whitespace-nowrap h-16 flex items-center justify-center">
                            المحصلة{" "}
                            {sortField === "final" &&
                              (sortDirection === "asc" ? "↑" : "↓")}
                          </div>
                        </th>
                        <th className="py-2 px-1 border-b border-gray-700/50 print:border-gray-300 w-16 bg-gray-900/50 print:hidden font-bold">
                          <div className="whitespace-nowrap flex items-center justify-center">
                            المسار
                          </div>
                        </th>
                      </tr>
                      <tr className="bg-gray-900/80 font-bold text-gray-400 border-b-2 border-purple-500/30 print:bg-white print:text-gray-500 print:border-gray-300">
                        <th className="py-1 border-l border-gray-700/50 print:border-gray-300"></th>
                        <th className="py-1 border-l border-gray-700/50 print:border-gray-300"></th>
                        <th className="py-1 border-l border-gray-700/50 print:border-gray-300">
                          20
                        </th>
                        <th className="py-1 border-l border-gray-700/50 print:border-gray-300">
                          20
                        </th>
                        <th className="py-1 border-l border-gray-700/50 print:border-gray-300">
                          20
                        </th>
                        <th className="py-1 border-l border-gray-700/50 print:border-gray-300">
                          40
                        </th>
                        <th className="py-1 border-l border-gray-700/50 print:border-gray-300 bg-purple-900/30 print:bg-blue-50">
                          100
                        </th>
                        <th className="py-1 bg-cyan-900/30 print:bg-red-50">
                          20
                        </th>
                        <th className="py-1 border-gray-700/50 bg-gray-900/50 print:hidden">
                        </th>
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
                          if (isEditing) {
                            return (
                              <input
                                type="number"
                                autoFocus
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={handleBlur}
                                onKeyDown={handleKeyDown}
                                className="w-full text-center bg-gray-800 text-cyan-400 focus:outline-none focus:ring-1 ring-cyan-400 print:text-black"
                              />
                            );
                          }
                          return (
                            <div
                              onClick={() =>
                                handleCellClick(student.id, field, value)
                              }
                              className="w-full h-full cursor-pointer hover:bg-purple-900/40 min-h-[20px] text-gray-300 print:text-black transition-colors"
                            >
                              {value === null ? "" : value}
                            </div>
                          );
                        };

                        return (
                          <tr
                            key={student.id}
                            className={`border-b border-gray-800 hover:bg-gray-800/80 print:border-gray-200 print:hover:bg-transparent ${idx % 2 === 0 ? "bg-transparent" : "bg-gray-900/40"}`}
                          >
                            <td className="py-2 px-1 border-l border-gray-800 font-bold text-gray-500 print:border-gray-200">
                              {idx + 1}
                            </td>
                            <td className="py-2 px-2 border-l border-gray-800 text-right font-medium text-gray-200 print:text-black print:border-gray-200">
                              {student.name}
                            </td>
                            <td className="py-2 px-1 border-l border-gray-800 print:border-gray-200">
                              {renderCell("homework", grades?.homework ?? null)}
                            </td>
                            <td className="py-2 px-1 border-l border-gray-800 print:border-gray-200">
                              {renderCell(
                                "attendance",
                                grades?.attendance ?? null,
                              )}
                            </td>
                            <td className="py-2 px-1 border-l border-gray-800 print:border-gray-200">
                              {renderCell("oral", grades?.oral ?? null)}
                            </td>
                            <td className="py-2 px-1 border-l border-gray-800 print:border-gray-200">
                              {renderCell("written", grades?.written ?? null)}
                            </td>
                            <td className="py-2 px-1 border-l border-gray-800 print:border-gray-200 bg-purple-900/20 print:bg-blue-50/30 font-bold text-purple-300 print:text-black">
                              {total}
                            </td>
                            <td className="py-2 px-1 border-l border-gray-800 bg-cyan-900/20 print:bg-red-50/30 font-bold text-cyan-300 print:text-black">
                              {final}
                            </td>
                            <td className="py-1 px-1 bg-gray-900/50 print:hidden text-center align-middle">
                              {(() => {
                                const m1 = calculateTotal(student.grades?.month1);
                                const m2 = calculateTotal(student.grades?.month2);
                                const m3 = calculateTotal(student.grades?.month3);
                                const data = [m1, m2, m3];
                                const max = Math.max(...data, 1);
                                const min = Math.min(...data);
                                const diff = m3 - m1;
                                const isUp = diff > 0;
                                const isDown = diff < 0;
                                
                                return (
                                  <div className="flex items-center justify-center w-full h-full gap-1">
                                    <div className="w-12 h-6 flex items-end justify-between px-1 gap-[2px]">
                                      {data.map((val, i) => (
                                        <div key={i} className="w-full bg-gray-700/50 rounded-t-sm relative group h-full flex flex-col justify-end">
                                           <div 
                                             className={`w-full rounded-t-sm ${isUp ? 'bg-green-500' : isDown ? 'bg-rose-500' : 'bg-gray-400'}`} 
                                             style={{ height: `${(val / 100) * 100}%` }}
                                           ></div>
                                        </div>
                                      ))}
                                    </div>
                                    <span className={`text-[10px] font-bold ${isUp ? 'text-green-400' : isDown ? 'text-rose-400' : 'text-gray-400'}`}>
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
                <div
                  className="font-serif border-[3px] border-black p-2 min-w-[800px] h-full"
                  dir="rtl"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                      <div className="text-center font-bold text-xs border border-black p-2">
                        <p>المملكة العربية السعودية</p>
                        <p>وزارة التعليم</p>
                        <p>الإدارة العامة للتعليم</p>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div className="bg-teal-600 text-white font-bold px-8 py-2 rounded-full text-xl border-4 border-white shadow-md relative z-10">
                        كشف متابعة الطلاب
                      </div>
                      <div className="w-full flex justify-between items-center px-8 text-sm font-bold text-teal-800 mt-2">
                        <div>
                          المادة / المقرر:{" "}
                          <span
                            className="border-b border-black inline-block w-32"
                            contentEditable
                            suppressContentEditableWarning
                          ></span>
                        </div>
                        <div>
                          الشعبة / الصف:{" "}
                          <span
                            className="border-b border-black inline-block w-32"
                            contentEditable
                            suppressContentEditableWarning
                          ></span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1 font-bold">
                      <div className="text-teal-700 font-bold flex items-center gap-1">
                        <span className="text-xs">VISION</span>
                        <span className="text-xl">2030</span>
                      </div>
                    </div>
                  </div>

                  <table className="border-collapse border border-black w-full text-center text-[10px] font-bold mt-4">
                    <thead>
                      <tr className="bg-teal-600 text-white">
                        <th
                          className="border border-black p-2 w-10 text-center"
                          rowSpan={3}
                        >
                          م
                        </th>
                        <th
                          className="border border-black p-2 w-48 text-center"
                          rowSpan={3}
                        >
                          اسم الطالب
                        </th>
                        <th
                          className="border border-black p-1 text-center"
                          colSpan={3}
                        >
                          المهام الأدائية والمشاركة والتفاعل 40 درجة
                        </th>
                        <th
                          className="border border-black p-1 text-center"
                          rowSpan={2}
                        >
                          تقويمات
                        </th>
                        <th
                          className="border border-black p-1 w-12 text-center"
                          rowSpan={3}
                        >
                          الاختبار النهائي
                          <br />
                          40 درجة
                        </th>
                        <th
                          className="border border-black p-1 w-12 text-center"
                          rowSpan={3}
                        >
                          المجموع
                          <br />
                          100 درجة
                        </th>
                      </tr>
                      <tr className="bg-teal-600 text-white">
                        <th className="border border-black p-1 text-center">
                          المشاركة
                          <br />
                          10 درجات
                        </th>
                        <th className="border border-black p-1 text-center">
                          المهام الأدائية
                          <br />
                          20 درجة
                        </th>
                        <th className="border border-black p-1 text-center">
                          الواجبات
                          <br />
                          10 درجات
                        </th>
                      </tr>
                      <tr className="bg-teal-500/50 text-black">
                        <th className="border border-black p-0 h-6">
                          <div className="flex h-full w-full">
                            {[...Array(4)].map((_, i) => (
                              <div
                                key={i}
                                className="flex-1 border-l border-black last:border-l-0"
                                contentEditable
                                suppressContentEditableWarning
                              ></div>
                            ))}
                          </div>
                        </th>
                        <th className="border border-black p-0 h-6">
                          <div className="flex h-full w-full">
                            {[...Array(4)].map((_, i) => (
                              <div
                                key={i}
                                className="flex-1 border-l border-black last:border-l-0"
                                contentEditable
                                suppressContentEditableWarning
                              ></div>
                            ))}
                          </div>
                        </th>
                        <th className="border border-black p-0 h-6">
                          <div className="flex h-full w-full">
                            {[...Array(4)].map((_, i) => (
                              <div
                                key={i}
                                className="flex-1 border-l border-black last:border-l-0"
                                contentEditable
                                suppressContentEditableWarning
                              ></div>
                            ))}
                          </div>
                        </th>
                        <th className="border border-black p-0 h-6 bg-teal-600 text-white font-normal">
                          20 درجة
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student, idx) => (
                        <tr
                          key={`saudi-${student.id}`}
                          className="bg-white text-black"
                        >
                          <td className="border border-black p-1 bg-teal-50/50">
                            {idx + 1}
                          </td>
                          <td className="border border-black p-1 text-right pr-2">
                            {student.name}
                          </td>
                          <td className="border border-black p-0">
                            <div className="flex h-full w-full min-h-[24px]">
                              {[...Array(4)].map((_, i) => (
                                <div
                                  key={i}
                                  className="flex-1 border-l border-black last:border-l-0"
                                  contentEditable
                                  suppressContentEditableWarning
                                ></div>
                              ))}
                            </div>
                          </td>
                          <td className="border border-black p-0 bg-teal-50/30">
                            <div className="flex h-full w-full min-h-[24px]">
                              {[...Array(4)].map((_, i) => (
                                <div
                                  key={i}
                                  className="flex-1 border-l border-black last:border-l-0"
                                  contentEditable
                                  suppressContentEditableWarning
                                ></div>
                              ))}
                            </div>
                          </td>
                          <td className="border border-black p-0">
                            <div className="flex h-full w-full min-h-[24px]">
                              {[...Array(4)].map((_, i) => (
                                <div
                                  key={i}
                                  className="flex-1 border-l border-black last:border-l-0"
                                  contentEditable
                                  suppressContentEditableWarning
                                ></div>
                              ))}
                            </div>
                          </td>
                          <td
                            className="border border-black p-1 bg-teal-50/50"
                            contentEditable
                            suppressContentEditableWarning
                          ></td>
                          <td
                            className="border border-black p-1"
                            contentEditable
                            suppressContentEditableWarning
                          ></td>
                          <td
                            className="border border-black p-1 bg-teal-600/10"
                            contentEditable
                            suppressContentEditableWarning
                          ></td>
                        </tr>
                      ))}
                      {/* Add a few empty rows to fill the page */}
                      {[...Array(Math.max(0, 15 - students.length))].map(
                        (_, idx) => (
                          <tr
                            key={`saudi-empty-${idx}`}
                            className="bg-white text-black"
                          >
                            <td className="border border-black p-1 bg-teal-50/50 text-transparent">
                              0
                            </td>
                            <td
                              className="border border-black p-1 text-right pr-2"
                              contentEditable
                              suppressContentEditableWarning
                            ></td>
                            <td className="border border-black p-0">
                              <div className="flex h-full w-full min-h-[24px]">
                                {[...Array(4)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="flex-1 border-l border-black last:border-l-0"
                                    contentEditable
                                    suppressContentEditableWarning
                                  ></div>
                                ))}
                              </div>
                            </td>
                            <td className="border border-black p-0 bg-teal-50/30">
                              <div className="flex h-full w-full min-h-[24px]">
                                {[...Array(4)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="flex-1 border-l border-black last:border-l-0"
                                    contentEditable
                                    suppressContentEditableWarning
                                  ></div>
                                ))}
                              </div>
                            </td>
                            <td className="border border-black p-0">
                              <div className="flex h-full w-full min-h-[24px]">
                                {[...Array(4)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="flex-1 border-l border-black last:border-l-0"
                                    contentEditable
                                    suppressContentEditableWarning
                                  ></div>
                                ))}
                              </div>
                            </td>
                            <td
                              className="border border-black p-1 bg-teal-50/50"
                              contentEditable
                              suppressContentEditableWarning
                            ></td>
                            <td
                              className="border border-black p-1"
                              contentEditable
                              suppressContentEditableWarning
                            ></td>
                            <td
                              className="border border-black p-1 bg-teal-600/10"
                              contentEditable
                              suppressContentEditableWarning
                            ></td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>

                  <div className="bg-teal-600 text-white text-left p-1 mt-2 text-xs">
                    صفحة 1
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
