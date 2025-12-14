#!/bin/bash

echo "Ejecutando pruebas de carga para Wise Alertas..."

# Verificar si JMeter está instalado
if ! command -v jmeter &> /dev/null; then
    echo "Error: JMeter no está instalado o no está en el PATH"
    echo "Instala JMeter desde: https://jmeter.apache.org/download_jmeter.cgi"
    exit 1
fi

# Crear directorio de resultados si no existe
mkdir -p ../results

# Obtener timestamp para nombres únicos
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")

# Ejecutar prueba de carga
echo "Iniciando prueba de carga..."
jmeter -n -t "../wise-alertas-load-test.jmx" \
       -l "../results/load-test-results-${TIMESTAMP}.jtl" \
       -e -o "../results/html-report-${TIMESTAMP}"

echo "Prueba completada. Revisa los resultados en la carpeta results/"