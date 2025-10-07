# Guide Rapide - Tests et Analyse de Code

## Étape 1 : Installation des dépendances

Ouvrez une invite de commande dans le répertoire du projet et exécutez :

```cmd
composer install
```

Cela installera :
- PHPUnit 9.5
- PHP_CodeCoverage 9.2

## Étape 2 : Exécuter les tests

### Option A : Utiliser le script automatique (Recommandé)
```cmd
run-tests.bat
```

Ce script va :
1. Vérifier que Composer est installé
2. Installer les dépendances si nécessaire
3. Exécuter tous les tests
4. Générer les rapports de couverture
5. Ouvrir le rapport HTML

### Option B : Commandes manuelles

**Tests unitaires uniquement :**
```cmd
vendor\bin\phpunit --testsuite "Unit Tests"
```

**Tous les tests avec couverture :**
```cmd
vendor\bin\phpunit --coverage-html coverage-report --coverage-clover coverage.xml
```

**Rapport de couverture dans la console :**
```cmd
vendor\bin\phpunit --coverage-text
```

## Étape 3 : Voir les rapports de couverture

Ouvrez le fichier : `coverage-report\index.html` dans votre navigateur

## Étape 4 : Analyse SonarQube

### 4.1 Démarrer SonarQube (Docker - Recommandé)

```cmd
docker run -d --name sonarqube -p 9000:9000 sonarqube:latest
```

Attendez quelques minutes que SonarQube démarre, puis accédez à : http://localhost:9000

Identifiants par défaut :
- Login : `admin`
- Password : `admin`

### 4.2 Créer un projet et obtenir un token

1. Connectez-vous à http://localhost:9000
2. Créez un nouveau projet : **archiva-backend**
3. Allez dans **My Account** → **Security** → **Generate Token**
4. Copiez le token

### 4.3 Installer SonarScanner

**Windows :**
1. Téléchargez depuis : https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/
2. Extrayez l'archive
3. Ajoutez le répertoire `bin` au PATH Windows

### 4.4 Exécuter l'analyse

**Option A : Script automatique**
```cmd
run-sonar.bat
```

**Option B : Commande manuelle**
```cmd
sonar-scanner -Dsonar.login=VOTRE_TOKEN
```

### 4.5 Voir les résultats

Accédez à : http://localhost:9000/dashboard?id=archiva-backend

## Structure des Fichiers Créés

```
html/
├── composer.json                  # Dépendances PHP
├── phpunit.xml                    # Configuration PHPUnit
├── sonar-project.properties       # Configuration SonarQube
├── .gitignore                     # Exclusions Git
├── run-tests.bat                  # Script pour tests (Windows)
├── run-sonar.bat                  # Script pour SonarQube (Windows)
├── TESTING_README.md              # Documentation complète
├── QUICK_START_TESTS.md           # Ce fichier
│
├── tests/
│   ├── bootstrap.php              # Initialisation tests
│   ├── Unit/
│   │   ├── BaseModelTest.php      # Tests BaseModel
│   │   └── UserModelTest.php      # Tests User
│   └── Integration/
│       └── DatabaseTest.php       # Tests DB
│
├── vendor/                        # Dépendances (créé par Composer)
├── coverage-report/               # Rapports HTML (créé par tests)
├── test-results/                  # Résultats JUnit (créé par tests)
└── .phpunit.cache/                # Cache PHPUnit
```

## Résolution de Problèmes

### "composer: command not found"
Installez Composer depuis https://getcomposer.org/download/

### "No code coverage driver available"
Installez et activez Xdebug dans votre php.ini :
```ini
zend_extension=xdebug
```

### "Database connection failed" (tests d'intégration)
1. Créez la base de données de test :
```sql
CREATE DATABASE Archiva_test;
```

2. Modifiez les credentials dans `phpunit.xml` si nécessaire

### SonarQube ne démarre pas
Assurez-vous que Docker est installé et en cours d'exécution, ou utilisez l'installation locale de SonarQube.

## Métriques Attendues

### Couverture de Code
- **BaseModel** : 85-90%
- **User Model** : 80-85%
- **Global** : 75-80%

### Qualité SonarQube
- **Bugs** : 0
- **Vulnérabilités** : 0
- **Code Smells** : < 10
- **Duplication** : < 3%

## Commandes Utiles

```cmd
# Lister tous les tests
vendor\bin\phpunit --list-tests

# Exécuter un test spécifique
vendor\bin\phpunit tests/Unit/UserModelTest.php

# Tests avec sortie détaillée
vendor\bin\phpunit --verbose

# Nettoyer les rapports
rmdir /s /q coverage-report test-results .phpunit.cache
```

## Support

Pour plus de détails, consultez :
- **TESTING_README.md** - Documentation complète
- **BACKEND_CONFIG_GUIDE.md** - Configuration backend
- Documentation PHPUnit : https://phpunit.de/
- Documentation SonarQube : https://docs.sonarqube.org/
