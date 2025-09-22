// Audio Player System for Ditzy Website
// File: js/audio-player.js

let currentAudio = null;
let audioContext = null;
let audioAnalyser = null;
let audioSource = null;

// Initialize audio player when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAudioPlayer();
});

function initializeAudioPlayer() {
    const audioFile = document.getElementById('audioFile');
    const audioElement = document.getElementById('audioElement');
    
    if (audioFile) {
        audioFile.addEventListener('change', handleAudioFileSelect);
    }
    
    if (audioElement) {
        audioElement.addEventListener('loadedmetadata', onAudioLoaded);
        audioElement.addEventListener('timeupdate', updateProgress);
        audioElement.addEventListener('ended', onAudioEnded);
        audioElement.addEventListener('error', onAudioError);
    }
    
    // Create audio visualizer canvas
    createAudioVisualizer();
}

function handleAudioFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        // Validate file type
        if (!file.type.startsWith('audio/')) {
            showAudioError('Please select a valid audio file');
            return;
        }
        
        // Validate file size (max 50MB)
        const maxSize =
