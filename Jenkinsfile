pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: '*/main']], doGenerateSubmoduleConfigurations: false, extensions: []])
            }
        }
        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool name: 'sonar-pro', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
                    withSonarQubeEnv('SonarQube Server') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    // Retrieve the Docker password securely
                    def dockerPassword = credentials('DOCKER_PASSWORD')

                    // Use 'docker login' with the -p flag
                    sh(script: "docker login -u dockadministrator -p ${dockerPassword} docker.io", returnStatus: true)
                    sh "docker build -t myimage:latest ."
                }
            }
        }
        stage('Deploy to Docker Host') {
            steps {
                script {
                    // Retrieve the Docker password securely
                    def dockerPassword = credentials('DOCKER_PASSWORD')

                    sh(script: "docker login -u dockadministrator -p ${dockerPassword} docker.io", returnStatus: true)
                    sh "docker pull myimage:latest"
                    sh "docker run -d -p 3000:3000 --name mycont myimage:latest"
                }
            }
        }
    }
}
