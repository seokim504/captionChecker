SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

CoordMode,Pixel,Screen
CoordMode,mouse,Screen

;CoordMode, Mouse, Window

Loop
{
	ImageSearch, vx, vy, 590, 911, 648, 929,*30 dis_info.bmp
	if ErrorLevel = 0
	{
        ;Run,%A_ScriptDir% \node sshotForOCR.js
        ;Run,%A_ScriptDir% \python LiveOCR.py
		;Msgbox, Find!
		Run %ComSpec% /c node sshotforOCR.js,,Hide
		Sleep, 5000
		Run %ComSpec% /c python LiveOCR.py,,Hide
		Sleep, 25000

	}
	else if ErrorLevel = 1
	{
		;MsgBox, can't Find
		Sleep, 5000
	}
}

F8::
ExitApp
