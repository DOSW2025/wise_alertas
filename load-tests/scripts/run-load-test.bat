@echo off
echo Ejecutando pruebas de carga para Wise Alertas...

REM Verificar si JMeter está instalado
where jmeter >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: JMeter no está instalado o no está en el PATH
    echo Descarga JMeter desde: https://jmeter.apache.org/download_jmeter.cgi
    pause
    exit /b 1
)

REM Crear directorio de resultados si no existe
if not exist "..\results" mkdir "..\results"

REM Ejecutar prueba de carga
echo Iniciando prueba de carga...
jmeter -n -t "..\wise-alertas-load-test.jmx" -l "..\results\load-test-results-%date:~-4,4%%date:~-10,2%%date:~-7,2%-%time:~0,2%%time:~3,2%%time:~6,2%.jtl" -e -o "..\results\html-report-%date:~-4,4%%date:~-10,2%%date:~-7,2%-%time:~0,2%%time:~3,2%%time:~6,2%"

echo Prueba completada. Revisa los resultados en la carpeta results/
pause