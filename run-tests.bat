@echo off
REM Script pour exécuter tous les tests et générer les rapports

echo ========================================
echo Archiva Backend - Execution des Tests
echo ========================================
echo.

REM Vérifier si Composer est installé
where composer >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Composer n'est pas installé ou n'est pas dans le PATH
    echo Veuillez installer Composer depuis https://getcomposer.org/
    pause
    exit /b 1
)

REM Vérifier si vendor existe
if not exist "vendor\" (
    echo Installation des dépendances...
    call composer install
    if %ERRORLEVEL% NEQ 0 (
        echo ERREUR: Échec de l'installation des dépendances
        pause
        exit /b 1
    )
    echo.
)

REM Créer les répertoires pour les rapports
if not exist "test-results\" mkdir test-results

echo Exécution des tests unitaires...
echo --------------------------------
call vendor\bin\phpunit --testsuite "Unit Tests"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ATTENTION: Des tests unitaires ont échoué
    echo.
)

echo.
echo Exécution des tests d'intégration...
echo ------------------------------------
call vendor\bin\phpunit --testsuite "Integration Tests"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ATTENTION: Des tests d'intégration ont échoué (vérifiez la configuration de la base de données)
    echo.
)

echo.
echo Génération des rapports de couverture...
echo -----------------------------------------
call vendor\bin\phpunit --coverage-html coverage-report --coverage-clover coverage.xml --log-junit test-results\junit.xml
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ATTENTION: Échec de la génération des rapports
    echo.
)

echo.
echo ========================================
echo Tests terminés!
echo ========================================
echo.
echo Rapports générés:
echo - Couverture HTML: coverage-report\index.html
echo - Couverture XML (pour SonarQube): coverage.xml
echo - Résultats JUnit: test-results\junit.xml
echo.

REM Demander si l'utilisateur veut ouvrir le rapport
set /p OPEN_REPORT="Voulez-vous ouvrir le rapport de couverture? (o/n): "
if /i "%OPEN_REPORT%"=="o" (
    start coverage-report\index.html
)

echo.
echo Pour exécuter l'analyse SonarQube, utilisez:
echo sonar-scanner -Dsonar.login=VOTRE_TOKEN
echo.
pause
