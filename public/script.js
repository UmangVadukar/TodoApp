document.addEventListener('DOMContentLoaded', () => {
    const todosDiv = document.getElementById('todos');
    const todoForm = document.getElementById('todoForm');
    const title = document.getElementById('title');
    const desc = document.getElementById('description');
    const heading = document.getElementById('heading');
    
    // Function to fetch and display todos
    async function fetchTodos() {
        todosDiv.innerHTML = '';
        const response = await fetch('/todos');
        const todos = await response.json();
        todos.forEach(todo => {
            const todoElement = document.createElement('tr');
            todoElement.innerHTML = `
                <th scope="row"><span class="todo-title">${todo.title}</span></th>
                <td>    <span class="todo-description">${todo.description}</span>
                </td>
                <td><button onclick="deleteTodo('${todo._id}')" class="btn btn-danger"><i class="fa-solid fa-trash"></i></button>
                </td>
                <td>    <button id="updateButton" onclick="updateTodo('${todo._id}')" class="btn btn-warning"><i class="fa-solid fa-pen-to-square"></i></button>
                </td>
              </tr> 
            `;
            todosDiv.appendChild(todoElement);
        });
    }
    
    fetchTodos();
    
    // Function to handle form submission
    todoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const response = await fetch('/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description })
        });
        if (response.ok) {
            fetchTodos();
            showAlert('Todo added successfully','success');
            todoForm.reset();
        } else {
            showAlert('Failed to add todo' ,'error');
        }
    });
    

    window.updateTodo = async (id) => {
        try {
            const response = await fetch(`/todos/${id}`, {
                method: 'GET'
            });
    
            if (!response.ok) {
                showAlert('Failed to fetch todo details', 'error');
                return;
            }
    
            const todo = await response.json();
            updateTitle.value = todo.title;
            updateDescription.value = todo.description;
    
            // Show popup form when update button is clicked
            popupForm.style.display = 'block'; // Display the popup form
            todoForm.style.display = 'none';
            heading.style.marginTop = '13%';
    
            // Submit handler for popup form
            updateForm.addEventListener('submit', async (event) => {
                event.preventDefault(); // Prevent default form submission behavior
    
                const updatedTodo = {
                    title: updateTitle.value,
                    description: updateDescription.value
                };
    
                try {
                    const updateResponse = await fetch(`/todos/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatedTodo)
                    });
    
                    if (updateResponse.ok) {
                        showAlert('Todo updated successfully', 'success');
                        fetchTodos(); // Assuming fetchTodos() fetches and updates the todo list on the client side
                        popupForm.style.display = 'none';
                        todoForm.style.display = 'block';
                        heading.style.marginTop = '0%';
                        } else {
                        showAlert('Failed to update todo','error');
                    }
                } catch (error) {
                    console.error('Error updating todo:');
                    showAlert('An error occurred while updating todo','error');
                }
            });
        } catch (error) {
            console.error('Error fetching todo details:');
            showAlert('An error occurred while fetching todo details','error');
        }
    };
    
    
    
    // Function to delete a todo
    window.deleteTodo = async (id) => {
        const response = await fetch(`/todos/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            fetchTodos();
            showAlert('Todo deleted successfully','success');
        } else {
            showAlert('Failed to delete todo','error');
        }
    };
    

    function showAlert(message,type) {
        let backgroundColor;
    
        // Determine background color based on type
        if (type === "success") {
            backgroundColor = "linear-gradient(to right, #00e676, #00c853)"; // Green linear gradient
        } else if (type === "error") {
            backgroundColor = "linear-gradient(to right, #ff1744, #d90000)"; // Red linear gradient
        } else {
            backgroundColor = ""; // Default color for other types
        }
    
        Toastify({
            text: message,
            duration: 3000,
            close: true,
            backgroundColor: backgroundColor,
            onClick: function() {
                console.log("Toast notification clicked!");
            },
            onClose: function() {
                console.log("Toast notification closed!");
            }
        }).showToast();
    }
    
    
});
