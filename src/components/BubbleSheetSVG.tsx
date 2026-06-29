import React from 'react';

interface BubbleSheetSVGProps {
  questionCount: number;
  optionsPerQuestion?: number;
}

export function BubbleSheetSVG({ questionCount, optionsPerQuestion = 4 }: BubbleSheetSVGProps) {
  // Constants for pixel-perfect OMR scanning
  const width = 800; // SVG viewBox width
  const height = 1000; // SVG viewBox height
  const margin = 40;
  
  // Anchor points (Fiducial markers) for camera alignment
  const anchorSize = 30;
  
  // Generate questions
  const cols = 2;
  const questionsPerCol = Math.ceil(questionCount / cols);
  const colWidth = (width - margin * 2) / cols;
  
  const renderAnchor = (x: number, y: number) => (
    <rect x={x} y={y} width={anchorSize} height={anchorSize} fill="black" />
  );

  const options = ['A', 'B', 'C', 'D', 'E'].slice(0, optionsPerQuestion);

  return (
    <div className="w-full h-full flex justify-center items-center p-4">
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        className="w-full max-w-full bg-white shadow-sm border border-gray-200 print:shadow-none print:border-none"
        style={{ aspectRatio: `${width}/${height}` }}
      >
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.5" opacity="0.1"/>
          </pattern>
        </defs>
        
        {/* Background Grid for precision look */}
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* 4 Corner Anchors */}
        {renderAnchor(margin, margin)}
        {renderAnchor(width - margin - anchorSize, margin)}
        {renderAnchor(margin, height - margin - anchorSize)}
        {renderAnchor(width - margin - anchorSize, height - margin - anchorSize)}

        {/* Inner Border Box */}
        <rect 
          x={margin + anchorSize + 10} 
          y={margin + anchorSize + 10} 
          width={width - 2 * (margin + anchorSize + 10)} 
          height={height - 2 * (margin + anchorSize + 10)} 
          fill="none" 
          stroke="black" 
          strokeWidth="2" 
        />

        {/* Title */}
        <text x={width / 2} y={margin + anchorSize - 5} fontSize="18" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" fill="black">
          Sigma OMR Optical Mark Recognition Sheet
        </text>

        {/* Bubbles */}
        {Array.from({ length: questionCount }).map((_, i) => {
          const colIndex = Math.floor(i / questionsPerCol);
          const rowIndex = i % questionsPerCol;
          
          const startX = margin + anchorSize + 40 + (colIndex * colWidth);
          const startY = margin + anchorSize + 60 + (rowIndex * 30);
          
          return (
            <g key={i}>
              <text x={startX} y={startY + 5} fontSize="14" fontFamily="sans-serif" fontWeight="bold" textAnchor="end" fill="black">
                {i + 1}
              </text>
              {options.map((opt, optIdx) => {
                const cx = startX + 30 + (optIdx * 30);
                const cy = startY;
                return (
                  <g key={opt}>
                    <circle cx={cx} cy={cy} r="10" fill="none" stroke="black" strokeWidth="1.5" />
                    <text x={cx} y={cy + 4} fontSize="10" fontFamily="sans-serif" textAnchor="middle" fill="black">
                      {opt}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}
        
        {/* Student ID Grid */}
        <g transform={`translate(${margin + anchorSize + 30}, ${height - margin - anchorSize - 180})`}>
          <text x="0" y="0" fontSize="14" fontWeight="bold" fontFamily="sans-serif" fill="black">ID (رقم الجلوس)</text>
          {Array.from({ length: 6 }).map((_, colIdx) => (
            <g key={colIdx} transform={`translate(${colIdx * 25}, 15)`}>
              {Array.from({ length: 10 }).map((_, rowIdx) => (
                <g key={rowIdx} transform={`translate(0, ${rowIdx * 15})`}>
                  <circle cx="10" cy="10" r="6" fill="none" stroke="black" strokeWidth="1" />
                  <text x="10" y="13" fontSize="8" fontFamily="sans-serif" textAnchor="middle" fill="black">{rowIdx}</text>
                </g>
              ))}
            </g>
          ))}
        </g>
        
        {/* QR Code Placeholder for scanning validation */}
        <g transform={`translate(${width - margin - anchorSize - 150}, ${height - margin - anchorSize - 150})`}>
           <rect x="0" y="0" width="120" height="120" fill="none" stroke="black" strokeWidth="1" strokeDasharray="5,5" />
           <text x="60" y="60" fontSize="12" fontFamily="sans-serif" textAnchor="middle" fill="black">SCAN QR CODE</text>
        </g>
      </svg>
    </div>
  );
}
