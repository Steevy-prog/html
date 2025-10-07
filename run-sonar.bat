@echo off
REM Script pour exécuter l'analyse SonarQube

echo ========================================
echo Archiva Backend - Analyse SonarQube
echo ========================================
echo.

REM Vérifier si sonar-scanner est installé
where sonar-scanner >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: sonar-scanner n'est pas installé ou n'est pas dans le PATH
    echo.
    echo Pour installer sonar-scanner:
    echo 1. Téléchargez depuis: https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/
    echo 2. Extrayez l'archive
    echo 3. Ajoutez le répertoire bin au PATH
    echo.
    pause
    exit /b 1
)

REM Vérifier si les rapports de tests existent
if not exist "coverage.xml" (
    echo ATTENTION: coverage.xml n'existe pas
    echo Exécutez d'abord les tests avec: run-tests.bat
    echo.
    set /p RUN_TESTS="Voulez-vous exécuter les tests maintenant? (o/n): "
    if /i "!RUN_TESTS!"=="o" (
        call run-tests.bat
    ) else (
        echo Analyse SonarQube annulée
        pause
        exit /b 1
    )
)

echo.
echo Vérification de SonarQube...
echo ----------------------------

REM Vérifier si SonarQube est accessible
curl -s http://localhost:9000/api/system/status >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ATTENTION: SonarQube n'est pas accessible sur http://localhost:9000
    echo.
    echo Assurez-vous que SonarQube est démarré:
    echo - Via Docker: docker run -d --name sonarqube -p 9000:9000 sonarqube:latest
    echo - Ou démarrez SonarQube manuellement
    echo.
    set /p CONTINUE="Continuer quand même? (o/n): "
    if /i not "!CONTINUE!"=="o" (
        echo Analyse annulée
        pause
        exit /b 1
    )
)

echo.
echo Entrez votre token SonarQube:
echo (Obtenez-le depuis: http://localhost:9000/account/security)
set /p SONAR_TOKEN="Token: "

if "%SONAR_TOKEN%"=="" (
    echo ERREUR: Token requis
    pause
    exit /b 1
)

echo.
echo Exécution de l'analyse SonarQube...
echo -----------------------------------
sonar-scanner ^
  -Dsonar.projectKey=archiva-backend ^
  -Dsonar.sources=backend ^
  -Dsonar.tests=tests ^
  -Dsonar.host.url=http://localhost:9000 ^
  -Dsonar.login=%SONAR_TOKEN%

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERREUR: Échec de l'analyse SonarQube
    pause
    exit /b 1
)

echo.
echo ========================================
echo Analyse SonarQube terminée!
echo ========================================
echo.
echo Consultez les résultats sur:
echo http://localhost:9000/dashboard?id=archiva-backend
echo.

set /p OPEN_SONAR="Voulez-vous ouvrir SonarQube dans votre navigateur? (o/n): "
if /i "%OPEN_SONAR%"=="o" (
    start http://localhost:9000/dashboard?id=archiva-backend
)

pause
