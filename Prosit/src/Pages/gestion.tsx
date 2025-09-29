import Header from '../composants/header'
import Footer from '../composants/footer'
function Gestion(){
    return(
           // Sample user CERs data
        const userCers = [
            {
                id: 1,
                title: "Prosit 4.1 Développement avancé",
                category: "Développement",
                image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=80&h=60&fit=crop",
                date: "15 Nov 2024",
                status: "published",
                views: 245,
                favorites: 8
            },
            {
                id: 2,
                title: "Prosit 3.2 Base de données",
                category: "Base de données",
                image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=80&h=60&fit=crop",
                date: "10 Nov 2024",
                status: "published",
                views: 189,
                favorites: 5
            },
            {
                id: 3,
                title: "Prosit 2.3 Sécurité Web",
                category: "Sécurité",
                image: "https://images.unsplash.com/photo-1518932945647-7a1c969f8be2?w=80&h=60&fit=crop",
                date: "08 Nov 2024",
                status: "draft",
                views: 0,
                favorites: 0
            }
        ];

        let tags = [];

        // Function to show tab
        function showTab(tabName) {
            // Hide all tabs
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Remove active class from all tab buttons
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Show selected tab
            document.getElementById(tabName).classList.add('active');
            
            // Add active class to corresponding button
            const buttons = document.querySelectorAll('.tab-btn');
            if (tabName === 'my-cers') buttons[0].classList.add('active');
            else if (tabName === 'add-cer') buttons[1].classList.add('active');
            else if (tabName === 'analytics') buttons[2].classList.add('active');
        }

        // Function to get status badge HTML
        function getStatusBadge(status) {
            const statusMap = {
                'published': { class: 'status-published', text: 'Publié' },
                'draft': { class: 'status-draft', text: 'Brouillon' },
                'pending': { class: 'status-pending', text: 'En attente' }
            };
            
            const statusInfo = statusMap[status] || statusMap['draft'];
            return `<span class="status-badge ${statusInfo.class}">${statusInfo.text}</span>`;
        }

        // Function to create CER item
        function createCERItem(cer) {
            return `
                <div class="cer-item">
                    <img src="${cer.image}" alt="${cer.title}">
                    <div class="cer-item-info">
                        <div class="cer-item-title">${cer.title}</div>
                        <div class="cer-item-meta">
                            ${cer.category} • ${cer.date} • ${getStatusBadge(cer.status)}
                        </div>
                        <div class="cer-item-stats">
                            <span>👁 ${cer.views} vues</span>
                            <span>♥ ${cer.favorites} favoris</span>
                        </div>
                    </div>
                    <div class="cer-item-actions">
                        <button class="btn-sm btn-edit" onclick="editCER(${cer.id})">Modifier</button>
                        <button class="btn-sm btn-delete" onclick="deleteCER(${cer.id})">Supprimer</button>
                    </div>
                </div>
            `;
        }

        // Function to render user CERs
        function renderUserCERs() {
            const container = document.getElementById('cer-list');
            if (userCers.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 60px 20px; color: #666;">
                        <div style="font-size: 60px; margin-bottom: 20px;">📝</div>
                        <h3>Aucun CER créé</h3>
                        <p style="margin-bottom: 30px;">Commencez par créer votre premier CER</p>
                        <button class="btn-primary" onclick="showTab('add-cer')">Créer un CER</button>
                    </div>
                `;
            } else {
                container.innerHTML = userCers.map(createCERItem).join('');
            }
        }

        // Function to add tag
        function addTag(tagText) {
            tagText = tagText.trim();
            if (tagText && !tags.includes(tagText)) {
                tags.push(tagText);
                renderTags();
            }
        }

        // Function to remove tag
        function removeTag(index) {
            tags.splice(index, 1);
            renderTags();
        }

        // Function to render tags
        function renderTags() {
            const tagInput = document.getElementById('tag-input');
            const input = tagInput.querySelector('input');
            
            // Clear all tags except the input
            tagInput.innerHTML = '';
            
            // Add existing tags
            tags.forEach((tag, index) => {
                const tagElement = document.createElement('div');
                tagElement.className = 'tag';
                tagElement.innerHTML = `
                    ${tag}
                    <button type="button" class="remove-tag" onclick="removeTag(${index})">&times;</button>
                `;
                tagInput.appendChild(tagElement);
            });
            
            // Re-add the input field
            const newInput = document.createElement('input');
            newInput.type = 'text';
            newInput.placeholder = 'Ajouter un tag...';
            newInput.id = 'tag-input-field';
            tagInput.appendChild(newInput);
            
            // Re-attach event listeners
            setupTagInput();
        }

        // Function to setup tag input
        function setupTagInput() {
            const tagInputField = document.getElementById('tag-input-field');
            if (tagInputField) {
                tagInputField.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag(this.value);
                        this.value = '';
                    }
                });
            }
        }

        // Function to edit CER
        function editCER(id) {
            alert(`Fonctionnalité d'édition pour le CER ${id} sera implémentée`);
        }

        // Function to delete CER
        function deleteCER(id) {
            if (confirm('Êtes-vous sûr de vouloir supprimer ce CER ?')) {
                const index = userCers.findIndex(cer => cer.id === id);
                if (index !== -1) {
                    userCers.splice(index, 1);
                    renderUserCERs();
                }
            }
        }

        // Function to handle form submission
        function handleFormSubmit(e) {
            e.preventDefault();
            
            const formData = {
                title: document.getElementById('cer-title').value,
                category: document.getElementById('cer-category').value,
                level: document.getElementById('cer-level').value,
                description: document.getElementById('cer-description').value,
                tags: tags,
                image: document.getElementById('cer-image').files[0],
                content: document.getElementById('cer-content').files[0]
            };
            
            // Simulate successful submission
            alert('CER ajouté avec succès !');
            
            // Add to userCers array (simulation)
            const newCER = {
                id: userCers.length + 1,
                title: formData.title,
                category: formData.category,
                image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=80&h=60&fit=crop",
                date: new Date().toLocaleDateString('fr-FR'),
                status: 'published',
                views: 0,
                favorites: 0
            };
            
            userCers.unshift(newCER);
            
            // Reset form
            document.getElementById('cer-form').reset();
            tags = [];
            renderTags();
            
            // Switch to My CERs tab and update display
            showTab('my-cers');
            renderUserCERs();
        }

        // Initialize page
        document.addEventListener('DOMContentLoaded', function() {
            renderUserCERs();
            setupTagInput();
            
            // Setup form submission
            document.getElementById('cer-form').addEventListener('submit', handleFormSubmit);
            
            // Setup file upload previews
            document.getElementById('cer-image').addEventListener('change', function(e) {
                if (e.target.files[0]) {
                    const label = this.nextElementSibling.querySelector('div');
                    label.innerHTML = `
                        <div style="font-size: 24px; margin-bottom: 10px;">✅</div>
                        <div>Image sélectionnée: ${e.target.files[0].name}</div>
                    `;
                }
            });
            
            document.getElementById('cer-content').addEventListener('change', function(e) {
                if (e.target.files[0]) {
                    const label = this.nextElementSibling.querySelector('div');
                    label.innerHTML = `
                        <div style="font-size: 24px; margin-bottom: 10px;">✅</div>
                        <div>Fichier sélectionné: ${e.target.files[0].name}</div>
                    `;
                }
            });
        });
        <>
        <Header/>
        <main>
            <div className="page-header">
                <h1 className="page-title">Gérer mes CERs</h1>
                <a href="#" className="btn-add">Ajouter un CER</a>
            </div>

        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Titre</th>
                        <th>Spécialité</th>
                        <th>Niveaux</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Prosit 3.2 - Annuaire Active Directory</td>
                        <td>Réseau et Infra; Sécurité</td>
                        <td><span className="level">X3</span></td>
                        <td>11/07/2024</td>
                        <td>
                            <button className="btn-edit">Éditer</button>
                            <button className="btn-delete">Supprimer</button>
                        </td>
                    </tr>
                    <tr>
                        <td>Prosit 1.2 - Les réseaux LAN</td>
                        <td>Réseau et Infra; Sécurité</td>
                        <td><span className="level">X1</span></td>
                        <td>13/02/2024</td>
                        <td>
                            <button className="btn-edit">Éditer</button>
                            <button className="btn-delete">Supprimer</button>
                        </td>
                    </tr>
                    <tr>
                        <td>Prosit 4.2 - Charte d'un projet</td>
                        <td>Gestion de projet</td>
                        <td><span className="level">X4</span></td>
                        <td>01/07/2024</td>
                        <td>
                            <button className="btn-edit">Éditer</button>
                            <button className="btn-delete">Supprimer</button>
                        </td>
                    </tr>
                    <tr>
                        <td>Prosit 4.2 - Base de données analytique</td>
                        <td>Data</td>
                        <td><span className="level">X3</span></td>
                        <td>11/07/2024</td>
                        <td>
                            <button className="btn-edit">Éditer</button>
                            <button className="btn-delete">Supprimer</button>
                        </td>
                    </tr>
                    <tr>
                        <td>Prosit 1.2 - IHM intuitives</td>
                        <td>Génie-logiciel</td>
                        <td><span className="level">X1</span></td>
                        <td>11/07/2024</td>
                        <td>
                            <button className="btn-edit">Éditer</button>
                            <button className="btn-delete">Supprimer</button>
                        </td>
                    </tr>
                    <tr>
                        <td>SAM Gestion des ressources humaines</td>
                        <td>Gestion de projet</td>
                        <td><span className="level">X5</span></td>
                        <td>11/09/2024</td>
                        <td>
                            <button className="btn-edit">Éditer</button>
                            <button className="btn-delete">Supprimer</button>
                        </td>
                    </tr>
                    <tr>
                        <td>Prosit 4.3 - Investigation numérique</td>
                        <td>Sécurité</td>
                        <td><span className="level">X3</span></td>
                        <td>11/07/2024</td>
                        <td>
                            <button className="btn-edit">Éditer</button>
                            <button className="btn-delete">Supprimer</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        </main>
        <Footer/>
        </>
    )
}
export default Gestion