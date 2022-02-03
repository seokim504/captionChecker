SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

CoordMode,Pixel,Screen
CoordMode,mouse,Screen

;CoordMode, Mouse, Window

F9::
Loop
{
	ImageSearch, vx, vy, 1124, 530, 1187, 560,*30 dis_info.bmp
	if ErrorLevel = 0
	{
        Run,%A_ScriptDir% \node sshotForOCR.js
        Run,%A_ScriptDir% \python LiveOCR.py

	}
	else if ErrorLevel = 1
	{
		MsgBox, can't Find
		Sleep, 5000
	}
}

F8::
ExitApp
