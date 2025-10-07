#!/bin/bash

# Script pour exécuter l'analyse SonarQube
# Pour Linux/Mac

echo "========================================"
echo "Archiva Backend - Analyse SonarQube"
echo "========================================"
echo

# Vérifier si sonar-scanner est installé
if ! command -v sonar-scanner &> /dev/null; then
    echo "ERREUR: sonar-scanner n'est pas installé"
    echo
    echo "Pour installer sonar-scanner:"
    echo "- Mac: brew install sonar-scanner"
    echo "- Linux: Téléchargez depuis https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/"
    echo
    exit 1
fi

# Vérifier si les rapports de tests existent
if [ ! -f "coverage.xml" ]; then
    echo "ATTENTION: coverage.xml n'existe pas"
    echo "Exécutez d'abord les tests avec: ./run-tests.sh"
    echo
    read -p "Voulez-vous exécuter les tests maintenant? (o/n): " RUN_TESTS
    if [ "$RUN_TESTS" = "o" ] || [ "$RUN_TESTS" = "O" ]; then
        ./run-tests.sh
    else
        echo "Analyse SonarQube annulée"
        exit 1
    fi
fi

echo
echo "Vérification de SonarQube..."
echo "----------------------------"

# Vérifier si SonarQube est accessible
if ! curl -s http://localhost:9000/api/system/status > /dev/null 2>&1; then
    echo "ATTENTION: SonarQube n'est pas accessible sur http://localhost:9000"
    echo
    echo "Assurez-vous que SonarQube est démarré:"
    echo "- Via Docker: docker run -d --name sonarqube -p 9000:9000 sonarqube:latest"
    echo "- Ou démarrez SonarQube manuellement"
    echo
    read -p "Continuer quand même? (o/n): " CONTINUE
    if [ "$CONTINUE" != "o" ] && [ "$CONTINUE" != "O" ]; then
        echo "Analyse annulée"
        exit 1
    fi
fi

echo
echo "Entrez votre token SonarQube:"
echo "(Obtenez-le depuis: http://localhost:9000/account/security)"
read -p "Token: " SONAR_TOKEN

if [ -z "$SONAR_TOKEN" ]; then
    echo "ERREUR: Token requis"
    exit 1
fi

echo
echo "Exécution de l'analyse SonarQube..."
echo "-----------------------------------"
sonar-scanner \
  -Dsonar.projectKey=archiva-backend \
  -Dsonar.sources=backend \
  -Dsonar.tests=tests \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login="$SONAR_TOKEN"

if [ $? -ne 0 ]; then
    echo
    echo "ERREUR: Échec de l'analyse SonarQube"
    exit 1
fi

echo
echo "========================================"
echo "Analyse SonarQube terminée!"
echo "========================================"
echo
echo "Consultez les résultats sur:"
echo "http://localhost:9000/dashboard?id=archiva-backend"
echo

read -p "Voulez-vous ouvrir SonarQube dans votre navigateur? (o/n): " OPEN_SONAR
if [ "$OPEN_SONAR" = "o" ] || [ "$OPEN_SONAR" = "O" ]; then
    if command -v xdg-open &> /dev/null; then
        xdg-open "http://localhost:9000/dashboard?id=archiva-backend"
    elif command -v open &> /dev/null; then
        open "http://localhost:9000/dashboard?id=archiva-backend"
    else
        echo "Impossible d'ouvrir automatiquement. Accédez à:"
        echo "http://localhost:9000/dashboard?id=archiva-backend"
    fi
fi
