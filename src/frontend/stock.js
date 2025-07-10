document.addEventListener('DOMContentLoaded', () => {
    const userName = document.getElementById('userName');
    const logoutBtn = document.getElementById('logoutBtn');
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario && usuario.rol === 'admin') {
        userName.textContent = `Administrador: ${usuario.nombre}`;
        logoutBtn.style.display = 'inline-block';
    } else {
        window.location.href = 'iniciar.html';
    }
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('usuario');
        window.location.href = 'iniciar.html';
    });

    const stockContainer = document.getElementById('stockContainer');
    const mensajeStock = document.getElementById('mensajeStock');
    let productosStock = [];
    let productos = [];

    async function cargarStock() {
        stockContainer.innerHTML = 'Cargando...';
        try {
            const [respStock, respProd] = await Promise.all([
                fetch('http://localhost:3000/api/stocks'),
                fetch('http://localhost:3000/api/imagenes/productos')
            ]);
            productosStock = await respStock.json();
            const dataProd = await respProd.json();
            productos = (dataProd && dataProd.success && Array.isArray(dataProd.data)) ? dataProd.data : [];
            mostrarStock();
        } catch (error) {
            stockContainer.innerHTML = '<p>Error al cargar el stock.</p>';
        }
    }

    function mostrarStock() {
        if (!productosStock.length) {
            stockContainer.innerHTML = '<p>No hay productos con stock registrado.</p>';
            return;
        }
        stockContainer.innerHTML = `
            <table class="stock-table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Categoría</th>
                        <th>Marca</th>
                        <th>Stock</th>
                        <th>Stock Mínimo</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    ${productosStock.map(p => {
                        const prod = productos.find(prod => prod.id_producto === p.id_producto) || {};
                        const stock = p.stock;
                        const stockMinimo = p.stock_minimo;
                        let stockClass = '';
                        
                        // Determinar el nivel de stock
                        if (stock <= stockMinimo) {
                            stockClass = 'stock-bajo';
                        } else if (stock <= stockMinimo * 2) {
                            stockClass = 'stock-medio';
                        } else {
                            stockClass = 'stock-alto';
                        }
                        
                        return `
                        <tr data-id="${p.id_stock}" class="${stockClass}">
                            <td>${prod.nombre || '-'}</td>
                            <td>${prod.categoria || '-'}</td>
                            <td>${prod.marca || '-'}</td>
                            <td><input type="number" class="input-stock" value="${p.stock}" min="0"></td>
                            <td><input type="number" class="input-minimo" value="${p.stock_minimo}" min="0"></td>
                            <td><button class="guardar-btn">Guardar</button></td>
                        </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
        asignarEventosStock();
    }

    function asignarEventosStock() {
        document.querySelectorAll('.stock-table tbody tr').forEach(row => {
            const inputStock = row.querySelector('.input-stock');
            const inputMinimo = row.querySelector('.input-minimo');
            const guardarBtn = row.querySelector('.guardar-btn');
            
            function actualizarColorFila() {
                const stock = parseInt(inputStock.value);
                const stockMinimo = parseInt(inputMinimo.value);
                
                // Remover clases anteriores
                row.classList.remove('stock-bajo', 'stock-medio', 'stock-alto');
                
                // Determinar y aplicar nueva clase
                if (stock <= stockMinimo) {
                    row.classList.add('stock-bajo');
                } else if (stock <= stockMinimo * 2) {
                    row.classList.add('stock-medio');
                } else {
                    row.classList.add('stock-alto');
                }
            }
            
            inputStock.addEventListener('input', actualizarColorFila);
            inputMinimo.addEventListener('input', actualizarColorFila);
            
            guardarBtn.addEventListener('click', async () => {
                const id = row.getAttribute('data-id');
                const stock = parseInt(inputStock.value);
                const stock_minimo = parseInt(inputMinimo.value);
                try {
                    const response = await fetch(`http://localhost:3000/api/stocks/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ stock, stock_minimo })
                    });
                    const data = await response.json();
                    if (
                        response.ok &&
                        data &&
                        typeof data.id_stock !== 'undefined' &&
                        typeof data.stock !== 'undefined' &&
                        typeof data.stock_minimo !== 'undefined'
                    ) {
                        mensajeStock.innerHTML = '<span style="color:green">Stock actualizado correctamente.</span>';
                        cargarStock();
                    } else {
                        mensajeStock.innerHTML = `<span style='color:red'>${data.message || 'Error al actualizar stock'}<br>${JSON.stringify(data)}</span>`;
                    }
                } catch (error) {
                    mensajeStock.innerHTML = `<span style='color:red'>Error al conectar con el servidor (actualizar): ${error}</span>`;
                }
            });
        });
    }

    cargarStock();
}); 