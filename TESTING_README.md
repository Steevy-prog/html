# Guide des Tests et Analyse de Code - Archiva Backend

Ce document décrit comment exécuter les tests unitaires, générer les rapports de couverture de code et effectuer l'analyse statique avec SonarQube.

## Prérequis

### Composer
Assurez-vous d'avoir Composer installé :
```bash
composer --version
```

### Installation des dépendances
```bash
composer install
```

## Configuration

### Base de données de test
Pour les tests d'intégration, créez une base de données de test :
```sql
CREATE DATABASE Archiva_test;
```

Modifiez les variables d'environnement dans `phpunit.xml` si nécessaire :
```xml
<php>
    <env name="DB_HOST" value="localhost"/>
    <env name="DB_NAME" value="Archiva_test"/>
    <env name="DB_USER" value="root"/>
    <env name="DB_PASS" value="votre_mot_de_passe"/>
</php>
```

## Exécution des Tests

### Tests Unitaires Uniquement
```bash
vendor/bin/phpunit --testsuite "Unit Tests"
```

### Tests d'Intégration Uniquement
```bash
vendor/bin/phpunit --testsuite "Integration Tests"
```

### Tous les Tests
```bash
vendor/bin/phpunit
```

ou via Composer :
```bash
composer test
```

### Tests avec Sortie Détaillée
```bash
vendor/bin/phpunit --verbose
```

## Couverture de Code (PHP_CodeCoverage)

### Générer un Rapport HTML
```bash
composer test-coverage
```
ou
```bash
vendor/bin/phpunit --coverage-html coverage-report --coverage-clover coverage.xml
```

Le rapport HTML sera généré dans `coverage-report/index.html`. Ouvrez ce fichier dans un navigateur pour voir les détails de la couverture.

### Rapport de Couverture en Console
```bash
composer test-coverage-text
```
ou
```bash
vendor/bin/phpunit --coverage-text
```

### Rapport de Couverture pour SonarQube
```bash
vendor/bin/phpunit --coverage-clover coverage.xml
```

Ce fichier `coverage.xml` sera utilisé par SonarQube pour l'analyse de la couverture.

## Analyse Statique avec SonarQube

### Installation de SonarQube

#### Option 1 : Docker (Recommandé)
```bash
docker run -d --name sonarqube -p 9000:9000 sonarqube:latest
```

#### Option 2 : Installation Locale
Téléchargez SonarQube depuis [sonarqube.org](https://www.sonarqube.org/downloads/)

### Installation du Scanner SonarQube

#### Windows
1. Téléchargez le scanner depuis [docs.sonarqube.org](https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/)
2. Extrayez l'archive
3. Ajoutez le répertoire `bin` au PATH

#### Linux/Mac
```bash
# Via Homebrew (Mac)
brew install sonar-scanner

# Via package manager (Linux)
wget https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.8.0.2856-linux.zip
unzip sonar-scanner-cli-4.8.0.2856-linux.zip
export PATH="$PATH:/path/to/sonar-scanner/bin"
```

### Configuration de SonarQube

1. Démarrez SonarQube (si vous utilisez Docker, il est déjà démarré)
2. Accédez à http://localhost:9000
3. Connectez-vous avec les identifiants par défaut :
   - Login : `admin`
   - Password : `admin`
4. Créez un nouveau projet avec la clé `archiva-backend`
5. Générez un token d'authentification

### Exécution de l'Analyse

#### Avec Token
```bash
sonar-scanner -Dsonar.login=VOTRE_TOKEN
```

#### Configuration complète
```bash
sonar-scanner \
  -Dsonar.projectKey=archiva-backend \
  -Dsonar.sources=backend \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=VOTRE_TOKEN
```

Le fichier `sonar-project.properties` contient déjà toutes les configurations nécessaires.

## Workflow Complet

Pour exécuter tous les tests et analyses en une seule fois :

### Windows
```cmd
composer install
vendor\bin\phpunit --coverage-clover coverage.xml --log-junit test-results\junit.xml
sonar-scanner -Dsonar.login=VOTRE_TOKEN
```

### Linux/Mac
```bash
composer install
vendor/bin/phpunit --coverage-clover coverage.xml --log-junit test-results/junit.xml
sonar-scanner -Dsonar.login=VOTRE_TOKEN
```

## Structure des Tests

```
tests/
├── bootstrap.php           # Configuration et initialisation des tests
├── Unit/                   # Tests unitaires (sans dépendances externes)
│   ├── BaseModelTest.php
│   └── UserModelTest.php
└── Integration/            # Tests d'intégration (avec base de données)
    └── DatabaseTest.php
```

## Métriques de Qualité

### Objectifs de Couverture
- **Couverture globale** : ≥ 80%
- **Couverture des modèles** : ≥ 90%
- **Couverture des contrôleurs** : ≥ 75%

### Standards SonarQube
- **Bugs** : 0
- **Vulnérabilités** : 0
- **Code Smells** : Minimum
- **Dette technique** : < 5%
- **Duplication** : < 3%

## Rapports Générés

### PHPUnit
- `coverage-report/` : Rapport HTML de couverture
- `coverage.xml` : Rapport Clover pour SonarQube
- `test-results/junit.xml` : Résultats des tests au format JUnit

### SonarQube
Les rapports sont disponibles sur l'interface web de SonarQube à http://localhost:9000

## Intégration Continue (CI/CD)

### GitHub Actions Example
```yaml
name: Tests and Analysis

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '7.4'
          extensions: pdo, pdo_mysql
          coverage: xdebug
      
      - name: Install dependencies
        run: composer install
      
      - name: Run tests
        run: vendor/bin/phpunit --coverage-clover coverage.xml
      
      - name: SonarQube Scan
        uses: sonarsource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
```

## Dépannage

### Erreur : "No code coverage driver available"
Installez Xdebug :
```bash
# Windows (XAMPP)
# Éditez php.ini et ajoutez :
zend_extension=xdebug

# Linux/Mac
sudo apt-get install php-xdebug  # Ubuntu/Debian
brew install php-xdebug          # Mac
```

### Erreur : "Database connection failed"
Vérifiez que :
1. MySQL est démarré
2. La base de données de test existe
3. Les identifiants dans `phpunit.xml` sont corrects

### SonarQube ne trouve pas les rapports
Assurez-vous que :
1. Les tests ont été exécutés avant l'analyse
2. Les fichiers `coverage.xml` et `test-results/junit.xml` existent
3. Les chemins dans `sonar-project.properties` sont corrects

## Ressources

- [Documentation PHPUnit](https://phpunit.de/documentation.html)
- [PHP_CodeCoverage](https://github.com/sebastianbergmann/php-code-coverage)
- [Documentation SonarQube](https://docs.sonarqube.org/)
- [Règles PHP SonarQube](https://rules.sonarsource.com/php/)

## Scripts Utiles

### Nettoyer les rapports
```bash
# Windows
rmdir /s /q coverage-report test-results .phpunit.cache

# Linux/Mac
rm -rf coverage-report test-results .phpunit.cache
```

### Vérifier le statut PHPUnit
```bash
vendor/bin/phpunit --version
```

### Lister tous les tests
```bash
vendor/bin/phpunit --list-tests
```
