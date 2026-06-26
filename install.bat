@echo off
title NexusAI — Install & Dev Server
echo.
echo  ============================================
echo   NexusAI Hackathon Build — Setup Script
echo  ============================================
echo.
cd /d "C:\Users\saira\OneDrive\Desktop\AI-poweredUI"
echo [1/2] Installing dependencies...
npm install
echo.
echo [2/2] Starting dev server...
echo  Open: http://localhost:3000
echo.
npm run dev
pause
