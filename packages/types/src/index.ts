export type PermissionStatus = 'prompt' | 'granted' | 'denied';

export type CommandType = 'stop' | 'come' | 'danger' | 'lighthouse';

export interface AppState {
  // Permissions
  micPermission: PermissionStatus;
  cameraPermission: PermissionStatus;

  // Audio State
  isPlaying: boolean;
  currentCommand: CommandType | null;
  barkDetected: boolean;
  barkThreshold: number; // 0.0 to 1.0

  // Feature Flags / Toggles
  lighthouseActive: boolean;
  showOnboarding: boolean;
  
  // Optional Gesture State
  gestureEnabled: boolean;
  lastGesture: string | null;
  gestureConfidence: number;
}

export const DEFAULT_APP_STATE: AppState = {
  micPermission: 'prompt',
  cameraPermission: 'prompt',
  isPlaying: false,
  currentCommand: null,
  barkDetected: false,
  barkThreshold: 0.3, // Default sensitivity
  lighthouseActive: false,
  showOnboarding: true,
  gestureEnabled: false,
  lastGesture: null,
  gestureConfidence: 0,
};

export interface AudioContextState {
  context: AudioContext | null;
  analyser: AnalyserNode | null;
  gain: GainNode | null;
}
