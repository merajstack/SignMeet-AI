import React from 'react';

interface HandSignGraphicProps {
  signId: string;
  className?: string;
}

export const HandSignGraphic: React.FC<HandSignGraphicProps> = ({ signId, className = "w-full h-full" }) => {
  const normId = signId.toLowerCase().trim();

  // Color constants matching the user's attached illustration style
  const bg = "#93ccff";       // Light blue canvas background
  const hand = "#033b82";     // Deep navy blue silhouette fill
  const stroke = "#c3e5ff";   // Fine white/light-blue line details (joints, palm creases)

  if (normId === 'open palm') {
    return (
      <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="400" fill={bg} rx="0" />
        {/* Open Palm Hand Silhouette */}
        <g>
          <path
            d="M 140 380 L 140 320 Q 140 280 130 240 Q 110 200 95 180 C 80 160 90 140 110 145 C 130 150 155 180 170 200 C 165 150 160 90 162 60 C 163 40 185 38 190 55 L 198 160 C 200 120 202 50 206 35 C 208 20 228 20 232 35 L 235 160 C 242 120 252 60 258 50 C 262 38 280 42 280 58 L 272 170 C 285 140 295 100 302 95 C 310 90 324 102 318 118 C 308 145 288 200 278 240 Q 260 300 250 380 Z"
            fill={hand}
          />
          {/* Finger joint and palm line details */}
          {/* Thumb creases */}
          <path d="M 120 165 Q 135 170 145 178" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 148 205 Q 170 215 190 220" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Index creases */}
          <path d="M 166 85 Q 176 87 186 85" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 168 120 Q 179 122 189 120" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Middle creases */}
          <path d="M 209 60 Q 219 62 229 60" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 210 100 Q 221 102 231 100" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Ring creases */}
          <path d="M 252 80 Q 262 82 272 80" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 250 120 Q 260 122 270 120" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Pinky creases */}
          <path d="M 292 120 Q 302 123 310 122" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 283 150 Q 293 153 301 152" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Main Palm Lines */}
          <path d="M 130 240 Q 180 230 250 210" stroke={stroke} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 170 200 Q 210 260 190 320" stroke={stroke} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 145 330 Q 195 335 245 325" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  if (normId === 'thumbs up') {
    return (
      <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="400" fill={bg} rx="0" />
        {/* Thumbs Up Hand Silhouette */}
        <g>
          <path
            d="M 80 230 C 80 220 140 210 180 180 Q 210 150 215 100 Q 218 40 235 40 C 255 40 250 90 240 145 L 235 155 L 305 155 C 330 155 335 180 325 200 C 335 205 338 225 328 245 C 335 250 335 272 322 290 C 330 295 325 320 300 325 L 220 330 C 170 330 130 310 95 280 Z"
            fill={hand}
          />
          {/* Thumb joint detail */}
          <path d="M 225 110 Q 238 112 248 110" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Folded fingers divide lines */}
          <path d="M 235 195 Q 280 195 320 198" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 232 240 Q 275 240 322 243" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 228 285 Q 270 285 315 288" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Palm thumb webbing crease */}
          <path d="M 130 230 Q 180 250 225 280" stroke={stroke} strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  if (normId === 'thumbs down') {
    return (
      <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="400" fill={bg} rx="0" />
        {/* Thumbs Down Hand Silhouette */}
        <g>
          <path
            d="M 80 170 C 80 180 140 190 180 220 Q 210 250 215 300 Q 218 360 235 360 C 255 360 250 310 240 255 L 235 245 L 305 245 C 330 245 335 220 325 200 C 335 195 338 175 328 155 C 335 150 335 128 322 110 C 330 105 325 80 300 75 L 220 70 C 170 70 130 90 95 120 Z"
            fill={hand}
          />
          {/* Thumb joint detail */}
          <path d="M 225 290 Q 238 288 248 290" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Folded fingers divide lines */}
          <path d="M 235 205 Q 280 205 320 202" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 232 160 Q 275 160 322 157" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 228 115 Q 270 115 315 112" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Palm thumb webbing crease */}
          <path d="M 130 170 Q 180 150 225 120" stroke={stroke} strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  if (normId === 'index') {
    return (
      <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="400" fill={bg} rx="0" />
        {/* Index Finger Up Silhouette */}
        <g>
          <path
            d="M 140 380 L 140 300 Q 135 240 155 200 Q 160 180 210 180 C 215 180 215 130 215 70 C 215 45 245 45 250 70 L 250 200 C 285 200 295 220 288 240 C 298 250 295 275 282 290 C 290 298 285 320 265 330 L 240 380 Z"
            fill={hand}
          />
          {/* Index Finger creases */}
          <path d="M 220 100 Q 235 102 245 100" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 220 145 Q 235 147 245 145" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Folded knuckles creases */}
          <path d="M 245 235 Q 270 235 285 238" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 242 270 Q 268 270 282 273" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 238 305 Q 260 305 272 308" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Thumb crossed over folded fingers crease */}
          <path d="M 150 250 Q 185 220 235 220" stroke={stroke} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 155 310 Q 195 300 235 280" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  if (normId === 'index middle') {
    return (
      <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="400" fill={bg} rx="0" />
        {/* Index Middle (Victory / V-Sign) Silhouette */}
        <g>
          <path
            d="M 140 380 L 140 300 Q 135 240 155 200 C 160 170 178 70 185 55 C 190 40 218 45 215 65 L 202 185 C 218 170 248 70 255 58 C 260 45 288 50 282 68 L 252 210 C 285 215 295 235 288 250 C 298 260 292 280 278 295 L 240 380 Z"
            fill={hand}
          />
          {/* Index Finger creases */}
          <path d="M 183 95 Q 195 97 205 95" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 188 135 Q 200 137 208 135" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Middle Finger creases */}
          <path d="M 252 95 Q 265 97 275 95" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 245 135 Q 257 137 267 135" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Folded knuckles creases */}
          <path d="M 245 245 Q 270 245 285 248" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 240 280 Q 265 280 278 283" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Thumb crossed over folded fingers crease */}
          <path d="M 150 250 Q 185 220 235 225" stroke={stroke} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 155 310 Q 195 300 235 280" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  if (normId.includes('four fingers') || normId.includes('4 fingers') || normId === 'four fingers (thumb folded)') {
    return (
      <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="400" fill={bg} rx="0" />
        {/* Four Fingers Extended (Thumb Folded) Silhouette */}
        <g>
          <path
            d="M 140 380 L 140 310 C 140 280 152 240 162 60 C 163 40 185 38 190 55 L 198 160 C 200 120 202 50 206 35 C 208 20 228 20 232 35 L 235 160 C 242 120 252 60 258 50 C 262 38 280 42 280 58 L 272 170 C 285 140 295 100 302 95 C 310 90 324 102 318 118 C 308 145 288 200 278 240 Q 260 300 250 380 Z"
            fill={hand}
          />
          {/* Index creases */}
          <path d="M 166 85 Q 176 87 186 85" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 168 120 Q 179 122 189 120" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Middle creases */}
          <path d="M 209 60 Q 219 62 229 60" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 210 100 Q 221 102 231 100" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Ring creases */}
          <path d="M 252 80 Q 262 82 272 80" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 250 120 Q 260 122 270 120" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Pinky creases */}
          <path d="M 292 120 Q 302 123 310 122" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 283 150 Q 293 153 301 152" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Thumb folded horizontally across lower palm */}
          <path d="M 140 280 C 160 250 200 240 225 240 C 235 240 235 260 220 268 C 190 280 160 295 140 310 Z" fill={hand} stroke={stroke} strokeWidth="2" />
          <path d="M 170 255 Q 200 250 220 252" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Main Palm Lines */}
          <path d="M 170 200 Q 210 230 250 210" stroke={stroke} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 145 330 Q 195 335 245 325" stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  // Fallback default
  return (
    <div className={`bg-[#93ccff] flex items-center justify-center ${className}`}>
      <span className="material-symbols-outlined text-[#033b82] text-5xl">pan_tool</span>
    </div>
  );
};
