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
                    // Run SonarQube analysis using the 'Sonar' credentials
                    withSonarQubeEnv(credentialsId: 'Sonar') {
                        sh 'sonar-scanner' // Replace with your actual SonarQube analysis command
                    }
                }
            }
        }

        stage("Quality Gate") {
            steps {
                sleep(60)
                timeout(time: 1, unit: 'HOURS') {
                    // Wait for the quality gate to complete using the specified 'sonar' credentials
                    waitForQualityGate(abortPipeline: true, credentialsId: 'sonar')
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
