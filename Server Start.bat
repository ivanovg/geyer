@ECHO OFF

GOTO:RUNIT

:RUNIT
ECHO Starting node...
SET NODE_PATH=.;
cd server
REM SET NODEPATH=C:\Program Files (x86)\nodejs
REM SET NODEPATH=C:\Program Files\_code\nodejs
REM SET NODEPATH=Z:\Apps\_code\NodeJSPortable\App\NodeJS
REM "%NODEPATH%\node" server.js
node server.js
REM PAUSE