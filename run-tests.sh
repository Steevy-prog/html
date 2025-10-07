#!/bin/bash

# Script pour exécuter tous les tests et générer les rapports
# Pour Linux/Mac

echo "========================================"
echo "Archiva Backend - Execution des Tests"
echo "========================================"
echo

# Vérifier si Composer est installé
if ! command -v composer &> /dev/null; then
    echo "ERREUR: Composer n'est pas installé"
    echo "Installez Composer depuis https://getcomposer.org/"
    exit 1
fi

# Vérifier si vendor existe
if [ ! -d "vendor" ]; then
    echo "Installation des dépendances..."
    composer install
    if [ $? -ne 0 ]; then
        echo "ERREUR: Échec de l'installation des dépendances"
        exit 1
    fi
    echo
fi

# Créer les répertoires pour les rapports
mkdir -p test-results

echo "Exécution des tests unitaires..."
echo "--------------------------------"
vendor/bin/phpunit --testsuite "Unit Tests"
if [ $? -ne 0 ]; then
    echo
    echo "ATTENTION: Des tests unitaires ont échoué"
    echo
fi

echo
echo "Exécution des tests d'intégration..."
echo "------------------------------------"
vendor/bin/phpunit --testsuite "Integration Tests"
if [ $? -ne 0 ]; then
    echo
    echo "ATTENTION: Des tests d'intégration ont échoué"
    echo "(vérifiez la configuration de la base de données)"
    echo
fi

echo
echo "Génération des rapports de couverture..."
echo "-----------------------------------------"
vendor/bin/phpunit --coverage-html coverage-report --coverage-clover coverage.xml --log-junit test-results/junit.xml
if [ $? -ne 0 ]; then
    echo
    echo "ATTENTION: Échec de la génération des rapports"
    echo
fi

echo
echo "========================================"
echo "Tests terminés!"
echo "========================================"
echo
echo "Rapports générés:"
echo "- Couverture HTML: coverage-report/index.html"
echo "- Couverture XML (pour SonarQube): coverage.xml"
echo "- Résultats JUnit: test-results/junit.xml"
echo

# Demander si l'utilisateur veut ouvrir le rapport
read -p "Voulez-vous ouvrir le rapport de couverture? (o/n): " OPEN_REPORT
if [ "$OPEN_REPORT" = "o" ] || [ "$OPEN_REPORT" = "O" ]; then
    if command -v xdg-open &> /dev/null; then
        xdg-open coverage-report/index.html
    elif command -v open &> /dev/null; then
        open coverage-report/index.html
    else
        echo "Impossible d'ouvrir automatiquement. Ouvrez manuellement: coverage-report/index.html"
    fi
fi

echo
echo "Pour exécuter l'analyse SonarQube, utilisez:"
echo "./run-sonar.sh"
echo "ou"
echo "sonar-scanner -Dsonar.login=VOTRE_TOKEN"
echo
