pipeline {
    agent any
    
    environment {
        DOCKER_HOST = 'unix:///var/run/docker.sock'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                sh 'docker-compose -f docker-compose.ci.yml build'
            }
        }
        
        stage('Test') {
            steps {
                sh 'docker-compose -f docker-compose.ci.yml run --rm app vendor/bin/phpunit'
            }
        }
        
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh 'docker-compose up -d --build'
            }
        }
    }
    
    post {
        always {
            // Nettoyage
            sh 'docker-compose -f docker-compose.ci.yml down --remove-orphans'
        }
    }
}