@echo off
if "%2"=="" (
  echo.
  echo usage:   %~nx0 [starting number] [ending number] [pad] [User Name Base]
  echo example: %~nx0  1  140 3 DEV160_ will output DEV160_001 to DEV160_140 
  echo.
  goto end
  )
rem .
setlocal enabledelayedexpansion
if "%3"=="" (
  for /l %%x in (%1, 1, %2) do (
    echo.%%x
  )
) else (
  set "mynum="
  for /l %%x in (%1, 1, %2) do (
    call set "mynum=00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000%%x"
    call set "mynum=%%mynum:~-%3%%"
    call set "var=xs set-space-role %4%%mynum%% HANAExpress development SpaceDeveloper"
    REM echo "!var!"
    REM call echo %4%%mynum%%
    call !var!
  )
)
:end