import {
  FaceLandmarker,
  FilesetResolver,
  NormalizedLandmark,
  Category,
} from '@mediapipe/tasks-vision';
import { ExpressionType, FaceMetrics } from '../types/bible';

const WASM_URL =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm';
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

let videoLandmarker: FaceLandmarker | null = null;
let imageLandmarker: FaceLandmarker | null = null;
let loadingPromise: Promise<FaceLandmarker> | null = null;

async function createLandmarker(runningMode: 'VIDEO' | 'IMAGE'): Promise<FaceLandmarker> {
  const vision = await FilesetResolver.forVisionTasks(WASM_URL);
  try {
    return await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: MODEL_URL,
        delegate: 'GPU',
      },
      outputFaceBlendshapes: true,
      runningMode,
      numFaces: 1,
    });
  } catch {
    // 모바일 GPU 가속 불가 시 CPU로 안전 폴백
    return await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: MODEL_URL,
        delegate: 'CPU',
      },
      outputFaceBlendshapes: true,
      runningMode,
      numFaces: 1,
    });
  }
}

export async function getVideoFaceLandmarker(): Promise<FaceLandmarker> {
  if (videoLandmarker) return videoLandmarker;
  if (!loadingPromise) {
    loadingPromise = createLandmarker('VIDEO').then((instance) => {
      videoLandmarker = instance;
      return instance;
    });
  }
  return loadingPromise;
}

export async function getImageFaceLandmarker(): Promise<FaceLandmarker> {
  if (imageLandmarker) return imageLandmarker;
  imageLandmarker = await createLandmarker('IMAGE');
  return imageLandmarker;
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function pt(lm: NormalizedLandmark, w: number, h: number) {
  return { x: lm.x * w, y: lm.y * h };
}

function dist(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// 얼굴 정면 여부 검사 (코 중앙과 양 볼의 대칭성으로 수평각 파악)
export function checkIsFaceFrontal(landmarks: NormalizedLandmark[]): {
  isFrontal: boolean;
  message: string;
} {
  if (!landmarks || landmarks.length < 468) {
    return { isFrontal: false, message: '얼굴을 가이드 중앙에 맞춰주세요' };
  }

  const leftCheek = landmarks[234];
  const rightCheek = landmarks[454];
  const noseTip = landmarks[1];
  const topForehead = landmarks[10];
  const chin = landmarks[152];

  const faceWidth = Math.abs(rightCheek.x - leftCheek.x);
  const faceHeight = Math.abs(chin.y - topForehead.y);

  if (faceWidth < 0.22 || faceHeight < 0.25) {
    return { isFrontal: false, message: '카메라에 조금 더 가까이 다가와 주세요' };
  }
  if (faceWidth > 0.85) {
    return { isFrontal: false, message: '카메라에서 살짝만 뒤로 물러나 주세요' };
  }

  // 좌우 회전 (Yaw)
  const dLeft = Math.abs(noseTip.x - leftCheek.x);
  const dRight = Math.abs(rightCheek.x - noseTip.x);
  const yawRatio = dLeft / (dRight || 0.001);

  if (yawRatio < 0.58 || yawRatio > 1.72) {
    return { isFrontal: false, message: '고개를 정면으로 바르게 돌려주세요' };
  }

  // 상하 기울기 (Pitch)
  const midY = (topForehead.y + chin.y) / 2;
  const pitchDiff = noseTip.y - midY;
  if (pitchDiff < -0.12) {
    return { isFrontal: false, message: '턱을 살짝 내리고 정면을 바라봐 주세요' };
  }
  if (pitchDiff > 0.14) {
    return { isFrontal: false, message: '고개를 살짝 들어 정면을 바라봐 주세요' };
  }

  return { isFrontal: true, message: '정면이 확인되었습니다. 은혜의 빛을 스캔 중입니다...' };
}

// 랜드마크 및 블렌드셰이프로부터 은혜의 척도 추출
export function extractFaceMetrics(
  landmarks: NormalizedLandmark[],
  blendshapes: Category[] | undefined,
  snapshotDataUrl?: string
): FaceMetrics {
  const w = 640;
  const h = 480;

  // 블렌드셰이프 맵
  const bsMap = new Map<string, number>();
  if (blendshapes) {
    for (const b of blendshapes) {
      bsMap.set(b.categoryName, b.score);
    }
  }

  const smileLeft = bsMap.get('mouthSmileLeft') || 0;
  const smileRight = bsMap.get('mouthSmileRight') || 0;
  const rawSmile = (smileLeft + smileRight) / 2;

  const browDownLeft = bsMap.get('browDownLeft') || 0;
  const browDownRight = bsMap.get('browDownRight') || 0;
  const browDown = (browDownLeft + browDownRight) / 2;

  const eyeWideLeft = bsMap.get('eyeWideLeft') || 0;
  const eyeWideRight = bsMap.get('eyeWideRight') || 0;
  const eyeWide = (eyeWideLeft + eyeWideRight) / 2;

  const eyeBlinkLeft = bsMap.get('eyeBlinkLeft') || 0;
  const eyeBlinkRight = bsMap.get('eyeBlinkRight') || 0;
  const eyeSquint = (eyeBlinkLeft + eyeBlinkRight) / 2;

  // 1. 미소 & 화평 점수 (0~100)
  const mouthL = pt(landmarks[61], w, h);
  const mouthR = pt(landmarks[291], w, h);
  const mouthTop = pt(landmarks[13], w, h);
  const mouthBottom = pt(landmarks[14], w, h);
  const mouthW = dist(mouthL, mouthR);
  const mouthH = dist(mouthTop, mouthBottom);
  const mouthRatio = mouthH / (mouthW || 1);

  const smileScore = Math.round(
    clamp(rawSmile * 82 + (mouthRatio > 0.12 ? 18 : 6), 25, 98)
  );

  // 2. 영적 활력 & 총명함 점수 (눈의 또렷함, 눈빛의 생기)
  const leftEyeTop = pt(landmarks[159], w, h);
  const leftEyeBottom = pt(landmarks[145], w, h);
  const leftEyeL = pt(landmarks[33], w, h);
  const leftEyeR = pt(landmarks[133], w, h);
  const leftEyeOpen = dist(leftEyeTop, leftEyeBottom) / (dist(leftEyeL, leftEyeR) || 1);

  const vitalityScore = Math.round(
    clamp(leftEyeOpen * 160 + eyeWide * 35 - eyeSquint * 20 + 20, 35, 96)
  );

  // 3. 좌우 균형 & 평강도
  const noseTip = pt(landmarks[1], w, h);
  const cheekL = pt(landmarks[234], w, h);
  const cheekR = pt(landmarks[454], w, h);
  const distL = dist(noseTip, cheekL);
  const distR = dist(noseTip, cheekR);
  const symRatio = Math.min(distL, distR) / (Math.max(distL, distR) || 1);
  const symmetryScore = Math.round(clamp(symRatio * 88 + 10, 45, 98));

  // 4. 고요함 & 잔잔한 평온 점수
  const calmScore = Math.round(
    clamp(100 - browDown * 55 - eyeWide * 25 + (1 - rawSmile * 0.4) * 20, 30, 95)
  );

  // 5. 피로도 / 안식 필요도
  const fatigueScore = Math.round(
    clamp(browDown * 55 + eyeSquint * 30 + (rawSmile < 0.15 ? 20 : 0), 10, 92)
  );

  // 표정 및 지배적 상태 도출
  let expression: ExpressionType = '온화하고 평안한 미소';
  let dominantMood: FaceMetrics['dominantMood'] = 'peace';

  if (fatigueScore >= 65) {
    expression = '살짝 지치고 쉼이 필요한 상태';
    dominantMood = 'rest';
  } else if (smileScore >= 68) {
    expression = '밝고 기쁨 넘치는 표정';
    dominantMood = 'joy';
  } else if (vitalityScore >= 78 && calmScore < 60) {
    expression = '새로운 용기를 품은 결단';
    dominantMood = 'courage';
  } else if (browDown > 0.25 || calmScore >= 75) {
    expression = '진지하고 또렷한 집중';
    dominantMood = 'wisdom';
  } else if (smileScore >= 45) {
    expression = '온화하고 평안한 미소';
    dominantMood = 'love';
  } else {
    expression = '차분하고 깊은 묵상 표정';
    dominantMood = 'peace';
  }

  // 얼굴에서 읽어낸 은혜의 특징 3가지
  const faceHighlights: string[] = [];

  if (smileScore >= 60) {
    faceHighlights.push('주님 안에서 감사가 배어 있는 밝고 따뜻한 미소');
  } else if (fatigueScore >= 60) {
    faceHighlights.push('오늘 하루 수고하고 애쓴 흔적이 담긴 정직한 얼굴');
  } else {
    faceHighlights.push('여호와 샬롬의 잔잔한 평강이 깃든 온화한 입가');
  }

  if (vitalityScore >= 70) {
    faceHighlights.push('비전과 사명을 향해 빛나는 총명하고 맑은 눈빛');
  } else {
    faceHighlights.push('주님의 세미한 음성에 귀 기울이는 깊고 차분한 눈빛');
  }

  if (symmetryScore >= 80) {
    faceHighlights.push('하나님의 형상을 닮아 은혜와 조화가 돋보이는 단정한 이목구비');
  } else {
    faceHighlights.push('삶의 진실함과 고백이 담긴 자연스럽고 편안한 인상');
  }

  return {
    smileScore,
    vitalityScore,
    symmetryScore,
    calmScore,
    fatigueScore,
    expression,
    faceHighlights,
    dominantMood,
    capturedAt: new Date().toISOString(),
    snapshotDataUrl,
  };
}

// 카메라 뷰파인더 위에 성스러운 오버레이(골드 십자가 가이드라인 & 빛무리) 렌더링
export function drawGracefulOverlay(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  landmarks: NormalizedLandmark[] | undefined,
  isFrontal: boolean,
  progress: number
) {
  ctx.clearRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2 - 10;
  // 단정한 둥근 원형 가이드
  const radius = Math.min(w, h) * 0.36;

  // 1. 바깥쪽 어두운 오버레이 마스크 (원형 제외)
  ctx.save();
  ctx.fillStyle = 'rgba(10, 17, 40, 0.45)';
  ctx.fillRect(0, 0, w, h);

  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. 둥근 원형 가이드 테두리 (골드 & 은혜의 빛)
  ctx.save();
  const guideGrad = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
  if (isFrontal) {
    guideGrad.addColorStop(0, '#fef08a');
    guideGrad.addColorStop(0.5, '#f59e0b');
    guideGrad.addColorStop(1, '#d97706');
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 18;
  } else {
    guideGrad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
    guideGrad.addColorStop(1, 'rgba(212, 175, 55, 0.5)');
    ctx.shadowColor = 'rgba(212, 175, 55, 0.3)';
    ctx.shadowBlur = 8;
  }

  ctx.strokeStyle = guideGrad;
  ctx.lineWidth = isFrontal ? 3.5 : 2;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 3. 상단 십자가 심볼
  ctx.save();
  ctx.strokeStyle = isFrontal ? '#fbbf24' : 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  const crossY = cy - radius + 22;
  ctx.beginPath();
  ctx.moveTo(cx, crossY - 9);
  ctx.lineTo(cx, crossY + 11);
  ctx.moveTo(cx - 7, crossY - 3);
  ctx.lineTo(cx + 7, crossY - 3);
  ctx.stroke();
  ctx.restore();

  // 4. 스캔 진행 프로그레스 원호
  if (progress > 0) {
    ctx.save();
    ctx.strokeStyle = '#38bdf8';
    ctx.shadowColor = '#0284c7';
    ctx.shadowBlur = 16;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(
      cx,
      cy,
      radius + 6,
      -Math.PI / 2,
      -Math.PI / 2 + Math.PI * 2 * progress
    );
    ctx.stroke();
    ctx.restore();
  }

  // 5. 얼굴 감지 시 주요 랜드마크에 은은한 골드 빛 파티클
  if (landmarks && landmarks.length > 0) {
    ctx.save();
    ctx.fillStyle = isFrontal ? 'rgba(251, 191, 36, 0.75)' : 'rgba(255, 255, 255, 0.4)';
    const keyPoints = [1, 33, 133, 159, 263, 362, 386, 61, 291, 13, 14, 152, 10, 67, 297];
    for (const idx of keyPoints) {
      const p = landmarks[idx];
      if (p) {
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }
}

// 데모용 가상 메트릭 생성
export function createDemoFaceMetrics(): FaceMetrics {
  const options: Array<{
    expression: ExpressionType;
    dominantMood: FaceMetrics['dominantMood'];
    smile: number;
    vitality: number;
    calm: number;
    fatigue: number;
    highlights: string[];
  }> = [
    {
      expression: '온화하고 평안한 미소',
      dominantMood: 'peace',
      smile: 72,
      vitality: 78,
      calm: 85,
      fatigue: 25,
      highlights: [
        '주님의 평안이 깃든 온화하고 따뜻한 미소',
        '선하고 맑은 눈빛에서 전해지는 영적 총명함',
        '단정하고 조화로운 하나님의 형상',
      ],
    },
    {
      expression: '밝고 기쁨 넘치는 표정',
      dominantMood: 'joy',
      smile: 88,
      vitality: 84,
      calm: 65,
      fatigue: 20,
      highlights: [
        '구원의 기쁨과 감사가 넘치는 활기찬 미소',
        '열정과 비전을 품은 반짝이는 눈빛',
        '주변을 환하게 밝히는 은혜로운 인상',
      ],
    },
    {
      expression: '살짝 지치고 쉼이 필요한 상태',
      dominantMood: 'rest',
      smile: 35,
      vitality: 52,
      calm: 60,
      fatigue: 74,
      highlights: [
        '오늘 하루 충성스럽게 달려와 쉼이 필요한 정직한 얼굴',
        '여호와 로이(목자 되신 주님)의 위로를 기다리는 눈빛',
        '주님의 품 안에서 참된 안식을 누릴 평안의 자리',
      ],
    },
    {
      expression: '새로운 용기를 품은 결단',
      dominantMood: 'courage',
      smile: 58,
      vitality: 90,
      calm: 62,
      fatigue: 30,
      highlights: [
        '믿음으로 담대하게 일어서는 결단의 눈빛',
        '두려움을 이기는 당당하고 굳센 이마',
        '주님의 약속을 신뢰하는 든든한 화평',
      ],
    },
  ];

  const picked = options[Math.floor(Math.random() * options.length)];

  return {
    smileScore: picked.smile,
    vitalityScore: picked.vitality,
    symmetryScore: 86,
    calmScore: picked.calm,
    fatigueScore: picked.fatigue,
    expression: picked.expression,
    faceHighlights: picked.highlights,
    dominantMood: picked.dominantMood,
    capturedAt: new Date().toISOString(),
    isDemo: true,
  };
}
