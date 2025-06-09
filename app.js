(function () {

    angular.module('app', ['angular-locker']);

    AppCtrl.$inject = ['$http', 'locker'];
    function AppCtrl($http, locker) {
        var vm = this;

        vm.totalSteps = 34;
        vm.sorting = locker.get('sorting', 0);
        vm.saveData = locker.get('save');
        vm.displayOwnedMonsters = locker.get('displayOwnedMonsters', true);
        vm.displayFinishedZones = locker.get('displayFinishedZones', true);
        vm.displayFinishedSteps = locker.get('displayFinishedSteps', true);

        // Système utilisateur
        vm.currentUser = locker.get('currentUser');
        vm.loginData = { username: '', password: '' };
        vm.registerData = { username: '', password: '', confirmPassword: '' };
        vm.showRegister = false;
        vm.syncMessage = '';
        vm.syncError = false;

        // API de base simulée (normalement ce serait un vrai serveur)
        vm.API_BASE = 'https://moisson-api.example.com'; // URL fictive pour l'exemple

        vm.isOwned = function(monster) {
            if (!vm.saveData || !monster) {
                return false;
            }

            return vm.saveData.indexOf(monster.id) >= 0;
        };

        vm.toggleMonster = function(monster, val) {
            vm.saveData = locker.get('save', []);

            if (vm.saveData.indexOf(monster.id) >= 0) {
                if (angular.isUndefined(val) || val === false) {
                    vm.saveData.splice(vm.saveData.indexOf(monster.id), 1);
                }
            } else {
                if (angular.isUndefined(val) || val === true) {
                    vm.saveData.push(monster.id);
                }
            }

            locker.put('save', vm.saveData);
            
            // Auto-sync si l'utilisateur est connecté
            if (vm.currentUser) {
                vm.autoSync();
            }
        };

        // Nouvelle fonction pour générer l'URL DofusDB
        vm.getDofusDbUrl = function(monster) {
            if (!monster || !monster.name) {
                return '#';
            }
            
            // Encode le nom du monstre pour l'URL
            var monsterName = encodeURIComponent(monster.name);
            
            // URL de base DofusDB pour la recherche de monstres
            return 'https://dofusdb.fr/fr/database/monsters?name=' + monsterName;
        };

        // Nouvelle fonction pour copier le nom du monstre
        vm.copyName = function(name, event) {
            event.stopPropagation(); // Empêche le toggle du monstre
            
            if (navigator.clipboard && window.isSecureContext) {
                // API moderne Clipboard
                navigator.clipboard.writeText(name).then(function() {
                    vm.showToast();
                }).catch(function(err) {
                    vm.fallbackCopy(name);
                });
            } else {
                // Fallback pour les navigateurs plus anciens
                vm.fallbackCopy(name);
            }
        };

        vm.fallbackCopy = function(text) {
            // Créer un élément textarea temporaire
            var textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                vm.showToast();
            } catch (err) {
                console.error('Erreur lors de la copie:', err);
                alert('Impossible de copier le texte. Veuillez sélectionner et copier manuellement: ' + text);
            }
            
            document.body.removeChild(textArea);
        };

        vm.showToast = function() {
            var toast = document.getElementById('toast');
            toast.style.display = 'block';
            setTimeout(function() {
                toast.style.display = 'none';
            }, 2000);
        };

        // === SYSTÈME D'AUTHENTIFICATION ===

        vm.login = function() {
            if (!vm.loginData.username || !vm.loginData.password) {
                alert('Veuillez remplir tous les champs');
                return;
            }

            // Simulation d'une API de connexion
            vm.simulateApiCall('/auth/login', {
                method: 'POST',
                data: vm.loginData
            }).then(function(response) {
                vm.currentUser = {
                    id: response.userId,
                    username: vm.loginData.username,
                    token: response.token
                };
                
                locker.put('currentUser', vm.currentUser);
                vm.loginData = { username: '', password: '' };
                
                // Charger les données de l'utilisateur
                vm.loadUserData();
                
                vm.setSyncMessage('Connexion réussie !', false);
            }).catch(function(error) {
                alert('Erreur de connexion: ' + error.message);
            });
        };

        vm.register = function() {
            if (!vm.registerData.username || !vm.registerData.password || !vm.registerData.confirmPassword) {
                alert('Veuillez remplir tous les champs');
                return;
            }

            if (vm.registerData.password !== vm.registerData.confirmPassword) {
                alert('Les mots de passe ne correspondent pas');
                return;
            }

            // Simulation d'une API d'inscription
            vm.simulateApiCall('/auth/register', {
                method: 'POST',
                data: {
                    username: vm.registerData.username,
                    password: vm.registerData.password
                }
            }).then(function(response) {
                vm.showRegister = false;
                vm.registerData = { username: '', password: '', confirmPassword: '' };
                alert('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
            }).catch(function(error) {
                alert('Erreur lors de la création du compte: ' + error.message);
            });
        };

        vm.logout = function() {
            vm.currentUser = null;
            locker.remove('currentUser');
            vm.setSyncMessage('Déconnecté', false);
        };

        // === SYNCHRONISATION DES DONNÉES ===

        vm.syncData = function() {
            if (!vm.currentUser) {
                alert('Vous devez être connecté pour synchroniser');
                return;
            }

            vm.setSyncMessage('Synchronisation...', false);

            // Sauvegarder sur le serveur
            vm.simulateApiCall('/user/save', {
                method: 'POST',
                data: {
                    saveData: vm.saveData,
                    preferences: {
                        sorting: vm.sorting,
                        displayOwnedMonsters: vm.displayOwnedMonsters,
                        displayFinishedZones: vm.displayFinishedZones,
                        displayFinishedSteps: vm.displayFinishedSteps
                    }
                }
            }).then(function(response) {
                vm.setSyncMessage('Synchronisé ✓', false);
                setTimeout(function() {
                    vm.setSyncMessage('', false);
                }, 3000);
            }).catch(function(error) {
                vm.setSyncMessage('Erreur de sync', true);
            });
        };

        vm.autoSync = function() {
            if (!vm.currentUser) return;
            
            // Throttle auto-sync to avoid too many requests
            clearTimeout(vm.autoSyncTimeout);
            vm.autoSyncTimeout = setTimeout(function() {
                vm.syncData();
            }, 2000);
        };

        vm.loadUserData = function() {
            if (!vm.currentUser) return;

            vm.simulateApiCall('/user/load', {
                method: 'GET'
            }).then(function(response) {
                if (response.saveData) {
                    vm.saveData = response.saveData;
                    locker.put('save', vm.saveData);
                }
                
                if (response.preferences) {
                    vm.sorting = response.preferences.sorting || 0;
                    vm.displayOwnedMonsters = response.preferences.displayOwnedMonsters !== false;
                    vm.displayFinishedZones = response.preferences.displayFinishedZones !== false;
                    vm.displayFinishedSteps = response.preferences.displayFinishedSteps !== false;
                    
                    locker.put('sorting', vm.sorting);
                    locker.put('displayOwnedMonsters', vm.displayOwnedMonsters);
                    locker.put('displayFinishedZones', vm.displayFinishedZones);
                    locker.put('displayFinishedSteps', vm.displayFinishedSteps);
                }
                
                vm.setSyncMessage('Données chargées ✓', false);
            }).catch(function(error) {
                vm.setSyncMessage('Erreur de chargement', true);
            });
        };

        vm.setSyncMessage = function(message, isError) {
            vm.syncMessage = message;
            vm.syncError = isError;
        };

        // Simulation d'API (en production, cela utiliserait $http vers un vrai serveur)
        vm.simulateApiCall = function(endpoint, options) {
            return new Promise(function(resolve, reject) {
                // Simulation d'un délai réseau
                setTimeout(function() {
                    // Simulation de données utilisateur stockées localement
                    var users = JSON.parse(localStorage.getItem('moisson_users') || '{}');
                    var userData = JSON.parse(localStorage.getItem('moisson_user_data') || '{}');
                    
                    switch(endpoint) {
                        case '/auth/login':
                            var username = options.data.username;
                            var password = options.data.password;
                            
                            if (users[username] && users[username].password === password) {
                                resolve({
                                    userId: users[username].id,
                                    token: 'fake-jwt-token-' + Math.random(),
                                    message: 'Login successful'
                                });
                            } else {
                                reject({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
                            }
                            break;
                            
                        case '/auth/register':
                            var username = options.data.username;
                            var password = options.data.password;
                            
                            if (users[username]) {
                                reject({ message: 'Nom d\'utilisateur déjà pris' });
                            } else {
                                var userId = 'user_' + Date.now();
                                users[username] = {
                                    id: userId,
                                    password: password,
                                    createdAt: new Date().toISOString()
                                };
                                localStorage.setItem('moisson_users', JSON.stringify(users));
                                resolve({ message: 'User created successfully' });
                            }
                            break;
                            
                        case '/user/save':
                            if (vm.currentUser) {
                                userData[vm.currentUser.id] = {
                                    saveData: options.data.saveData,
                                    preferences: options.data.preferences,
                                    lastSync: new Date().toISOString()
                                };
                                localStorage.setItem('moisson_user_data', JSON.stringify(userData));
                                resolve({ message: 'Data saved successfully' });
                            } else {
                                reject({ message: 'User not authenticated' });
                            }
                            break;
                            
                        case '/user/load':
                            if (vm.currentUser && userData[vm.currentUser.id]) {
                                resolve(userData[vm.currentUser.id]);
                            } else {
                                resolve({ saveData: null, preferences: null });
                            }
                            break;
                            
                        default:
                            reject({ message: 'Endpoint not found' });
                    }
                }, Math.random() * 1000 + 500); // Délai aléatoire entre 500ms et 1.5s
            });
        };

        // === FONCTIONS EXISTANTES ===

        vm.owned = function(type, zone, step) {
            if (!vm.monsters) {
                return '?';
            }

            return vm.monsters.filter(function(monster) {
                if (!vm.isOwned(monster)) {
                    return false;
                }

                if (!type && !zone && !step) {
                    return true;
                }

                if (type && monster.type == type) {
                    return true;
                }

                if (zone && monster.zones.indexOf(zone) >= 0) {
                    return true;
                }

                if (step && monster.step == step) {
                    return true;
                }

                return false;
            }).length;
        };

        vm.ownedPercentage = function(type, zone, step) {
            return Math.ceil(vm.owned(type, zone, step) * 100 / vm.total(type, zone, step)) || 0;
        };

        vm.total = function(type, zone, step) {
            if (!vm.monsters) {
                return '?';
            }

            return vm.monsters.filter(function(monster) {
                if (type) {
                    return monster.type == type;
                }

                if (zone) {
                    return monster.zones.indexOf(zone) >= 0;
                }

                if (step) {
                    return monster.step == step;
                }

                return true;
            }).length;
        };

        vm.load = function() {
            vm.saveData = vm.loadData;

            locker.put('save', vm.loadData.split(',').map(function(id) {
                return parseInt(id);
            }));

            vm.loadData = null;
            
            // Auto-sync si connecté
            if (vm.currentUser) {
                vm.autoSync();
            }
        };

        vm.toggleZone = function(zone) {
            var newVal = true;

            if (vm.owned(false, zone) == vm.total(false, zone)) {
                newVal = false;
            }

            vm.monsters.map(function(monster) {
                if (monster.zones.indexOf(zone) >= 0) {
                    vm.toggleMonster(monster, newVal);
                }
            });
        };

        vm.toggleStep = function(step) {
            var newVal = true;

            if (vm.owned(false, false, step) == vm.total(false, false, step)) {
                newVal = false;
            }

            vm.monsters.map(function(monster) {
                if (monster.step == step) {
                    vm.toggleMonster(monster, newVal);
                }
            });
        };

        vm.completedSteps = function() {
            if (!vm.monsters) {
                return '??';
            }

            return vm.monsters.map(function(monster) {
                return monster.step;
            }).sort().filter(function(step, index, steps) {
                return index == steps.indexOf(step);
            }).filter(function(step) {
                return vm.ownedPercentage(false, false, step) == 100;
            }).length;
        };

        vm.completedStepsPercentage = function() {
            return Math.ceil(vm.completedSteps() * 100 / vm.totalSteps);
        };

        vm.chooseSorting = function(sorting) {
            vm.sorting = sorting;
            locker.put('sorting', sorting);
            
            // Auto-sync si connecté
            if (vm.currentUser) {
                vm.autoSync();
            }
        };

        vm.toggleOwnedMonsters = function() {
            locker.put('displayOwnedMonsters', vm.displayOwnedMonsters);
            
            // Auto-sync si connecté
            if (vm.currentUser) {
                vm.autoSync();
            }
        }

        vm.toggleFinishedZones = function() {
            locker.put('displayFinishedZones', vm.displayFinishedZones);
            
            // Auto-sync si connecté
            if (vm.currentUser) {
                vm.autoSync();
            }
        }

        vm.toggleFinishedSteps = function() {
            locker.put('displayFinishedSteps', vm.displayFinishedSteps);
            
            // Auto-sync si connecté
            if (vm.currentUser) {
                vm.autoSync();
            }
        }

        vm.resetAll = function() {
            if (confirm('Dernière chance !')) {
                locker.clean();

                vm.sorting = 0;
                vm.saveData = null;
                vm.displayOwnedMonsters = true;
                vm.displayFinishedZones = true;
                vm.displayFinishedSteps = true;
                vm.zones = {};
                vm.steps = [];
                vm.monsters = [];

                $('#saveModal').modal('hide');
                
                // Sync reset si connecté
                if (vm.currentUser) {
                    vm.syncData();
                }
            }
        };

        // Chargement initial
        $http.get('monsters.json').then(function(res) {
            vm.monsters = res.data;

            vm.zones = {};
            vm.steps = [];

            angular.forEach(vm.monsters, function(monster) {
                angular.forEach(monster.zones, function(zone) {
                    if (angular.isUndefined(vm.zones[zone])) {
                        vm.zones[zone] = [];
                    }

                    vm.zones[zone].push(monster);
                });

                if (angular.isUndefined(vm.steps[monster.step])) {
                    vm.steps[monster.step] = [];
                }

                vm.steps[monster.step].push(monster);
            });
            
            // Si l'utilisateur est connecté, charger ses données
            if (vm.currentUser) {
                vm.loadUserData();
            }
        });
    }

    angular.module('app')
        .controller('AppCtrl', AppCtrl);

}());