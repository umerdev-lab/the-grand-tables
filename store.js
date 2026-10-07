/*
 * Shared data layer for The Grand Table (index.html) and its Admin Dashboard (admin.html).
 * Both pages must be served/opened from this same folder — they read/write the same
 * localStorage keys, so changes made in the admin panel (categories, products, order
 * status) are picked up by the live menu, and orders placed on the menu show up in
 * the admin panel. Open both pages in the same browser for live sync via the
 * "storage" event.
 */
const GTStore = (() => {
    const KEYS = {
        categories: 'gt_categories',
        products: 'gt_products',
        tables: 'gt_tables',
        waiterCalls: 'gt_waiter_calls'
    };

    // ===== SUPABASE (shared order database) =====
    // 1. Create a free project at https://supabase.com
    // 2. Run supabase-schema.sql (in this folder) in its SQL editor
    // 3. Paste your project's URL and anon/public API key below
    const SUPABASE_URL = 'https://pcmnzsghbkmfvlevlruh.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_9edwlGpk6tmI04SMmqXFlw_sZXc74k0';

    const supabaseConfigured = SUPABASE_URL.indexOf('YOUR-PROJECT') === -1 && SUPABASE_ANON_KEY.indexOf('YOUR-ANON-PUBLIC-KEY') === -1;
    const supabaseClient = (supabaseConfigured && typeof window !== 'undefined' && window.supabase)
        ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
        : null;

    if (!supabaseClient) {
        console.warn('GTStore: Supabase is not configured (see SUPABASE_URL/SUPABASE_ANON_KEY in store.js) — orders will use this device\'s localStorage only.');
    }

    function mapOrderRow(row) {
        return {
            id: row.id,
            table: row.table_number,
            items: row.items,
            subtotal: row.subtotal,
            total: row.total,
            payment: row.payment,
            status: row.status,
            createdAt: row.created_at
        };
    }

    function toOrderRow(order) {
        return {
            table_number: order.table,
            items: order.items,
            subtotal: order.subtotal,
            total: order.total,
            payment: order.payment,
            status: order.status,
            created_at: order.createdAt
        };
    }

    function readLocalOrders() { return read('gt_orders', []); }
    function writeLocalOrders(list) { write('gt_orders', list); }
    function nextLocalOrderId() {
        const seq = read('gt_order_seq', 1046) + 1;
        write('gt_order_seq', seq);
        return seq;
    }

    const DEFAULT_CATEGORIES = ['Starters', 'Burgers', 'Pizza', 'Main Course', 'Drinks', 'Desserts'];

    const DEFAULT_PRODUCTS = [{
        id: 1,
        name: 'Crispy Zinger Burger',
        desc: 'Crispy chicken, fresh lettuce and special sauce.',
        price: 650,
        category: 'Burgers',
        popular: true,
        rating: 4.8,
        badge: 'Bestseller',
        img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&q=80',
        veg: 'non-veg',
        available: true,
        discountPrice: null,
        sizes: [{ name: 'Regular', price: 650 }, { name: 'Large', price: 850 }],
        extras: [{ name: 'Extra Cheese', price: 100 }, { name: 'Extra Sauce', price: 50 }, { name: 'Extra Patty', price: 250 }]
    }, {
        id: 2,
        name: 'Creamy Alfredo Pasta',
        desc: 'Creamy parmesan sauce with perfectly cooked pasta.',
        price: 850,
        category: 'Starters',
        popular: true,
        rating: 4.6,
        badge: null,
        img: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop&q=80',
        veg: 'veg',
        available: true,
        discountPrice: null,
        sizes: [],
        extras: [{ name: 'Extra Cheese', price: 100 }, { name: 'Grilled Chicken', price: 150 }]
    }, {
        id: 3,
        name: 'Classic Pepperoni Pizza',
        desc: 'Loaded with mozzarella and premium pepperoni.',
        price: 950,
        category: 'Pizza',
        popular: true,
        rating: 4.9,
        badge: 'Popular',
        img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop&q=80',
        veg: 'non-veg',
        available: true,
        discountPrice: null,
        sizes: [{ name: 'Small', price: 950 }, { name: 'Medium', price: 1250 }, { name: 'Large', price: 1550 }],
        extras: [{ name: 'Extra Cheese', price: 150 }, { name: 'Extra Pepperoni', price: 200 }, { name: 'Extra Olives', price: 100 }]
    }, {
        id: 4,
        name: 'Grilled Chicken Steak',
        desc: 'Juicy grilled chicken with signature sauce.',
        price: 1450,
        category: 'Main Course',
        popular: true,
        rating: 4.7,
        badge: 'Chef Special',
        img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&q=80',
        veg: 'non-veg',
        available: true,
        discountPrice: null,
        sizes: [],
        extras: [{ name: 'Extra Sauce', price: 80 }, { name: 'Extra Fries', price: 150 }]
    }, {
        id: 5,
        name: 'Fresh Lemon Mojito',
        desc: 'Fresh lemon, mint and sparkling refreshment.',
        price: 350,
        category: 'Drinks',
        popular: true,
        rating: 4.5,
        badge: null,
        img: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop&q=80',
        veg: 'veg',
        available: true,
        discountPrice: null,
        sizes: [{ name: 'Regular', price: 350 }, { name: 'Large', price: 500 }],
        extras: []
    }, {
        id: 6,
        name: 'Chocolate Lava Cake',
        desc: 'Warm chocolate cake with a rich molten center.',
        price: 550,
        category: 'Desserts',
        popular: true,
        rating: 4.9,
        badge: 'Popular',
        img: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400&h=300&fit=crop&q=80',
        veg: 'veg',
        available: true,
        discountPrice: 450,
        sizes: [],
        extras: [{ name: 'Extra Ice Cream', price: 100 }]
    }, {
        id: 7,
        name: 'Bruschetta',
        desc: 'Toasted bread with ripe tomatoes and fresh basil.',
        price: 450,
        category: 'Starters',
        popular: false,
        rating: 4.3,
        badge: null,
        img: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop&q=80',
        veg: 'veg',
        available: true,
        discountPrice: null,
        sizes: [],
        extras: []
    }, {
        id: 8,
        name: 'Chicken Wings',
        desc: 'Crispy wings tossed in house special sauce.',
        price: 550,
        category: 'Starters',
        popular: false,
        rating: 4.6,
        badge: null,
        img: 'https://images.unsplash.com/photo-1608032077018-c9aad9565b7c?w=400&h=300&fit=crop&q=80',
        veg: 'non-veg',
        available: true,
        discountPrice: null,
        sizes: [{ name: '6 pcs', price: 550 }, { name: '12 pcs', price: 950 }],
        extras: [{ name: 'Extra Dip', price: 50 }]
    }, {
        id: 9,
        name: 'Spring Rolls',
        desc: 'Crispy vegetable spring rolls with sweet chili dip.',
        price: 350,
        category: 'Starters',
        popular: false,
        rating: 4.2,
        badge: null,
        img: 'https://images.unsplash.com/photo-1552611052-73e28590773b?w=400&h=300&fit=crop&q=80',
        veg: 'veg',
        available: true,
        discountPrice: null,
        sizes: [],
        extras: []
    }, {
        id: 10,
        name: 'Classic Cheeseburger',
        desc: 'Beef patty with cheddar, lettuce and tomato.',
        price: 550,
        category: 'Burgers',
        popular: false,
        rating: 4.5,
        badge: null,
        img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop&q=80',
        veg: 'non-veg',
        available: true,
        discountPrice: null,
        sizes: [{ name: 'Regular', price: 550 }, { name: 'Large', price: 750 }],
        extras: [{ name: 'Extra Cheese', price: 100 }, { name: 'Extra Sauce', price: 50 }, { name: 'Extra Patty', price: 250 }]
    }, {
        id: 11,
        name: 'BBQ Bacon Burger',
        desc: 'Smoky BBQ sauce, crispy bacon and beef patty.',
        price: 750,
        category: 'Burgers',
        popular: false,
        rating: 4.7,
        badge: null,
        img: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop&q=80',
        veg: 'non-veg',
        available: true,
        discountPrice: null,
        sizes: [{ name: 'Regular', price: 750 }, { name: 'Large', price: 950 }],
        extras: [{ name: 'Extra Cheese', price: 100 }, { name: 'Extra Bacon', price: 150 }]
    }, {
        id: 12,
        name: 'Margherita Pizza',
        desc: 'Classic tomato, mozzarella and fresh basil.',
        price: 750,
        category: 'Pizza',
        popular: false,
        rating: 4.6,
        badge: null,
        img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop&q=80',
        veg: 'veg',
        available: true,
        discountPrice: null,
        sizes: [{ name: 'Small', price: 750 }, { name: 'Medium', price: 950 }, { name: 'Large', price: 1200 }],
        extras: [{ name: 'Extra Cheese', price: 150 }, { name: 'Extra Olives', price: 100 }]
    }, {
        id: 13,
        name: 'BBQ Chicken Pizza',
        desc: 'Tangy BBQ sauce with grilled chicken and onions.',
        price: 1050,
        category: 'Pizza',
        popular: false,
        rating: 4.7,
        badge: null,
        img: 'https://images.unsplash.com/photo-1566843972142-a8fc0a5d3a22?w=400&h=300&fit=crop&q=80',
        veg: 'non-veg',
        available: true,
        discountPrice: null,
        sizes: [{ name: 'Small', price: 1050 }, { name: 'Medium', price: 1350 }, { name: 'Large', price: 1650 }],
        extras: [{ name: 'Extra Cheese', price: 150 }, { name: 'Extra Chicken', price: 200 }]
    }, {
        id: 14,
        name: 'Grilled Salmon',
        desc: 'Fresh Atlantic salmon with lemon herb butter.',
        price: 1650,
        category: 'Main Course',
        popular: false,
        rating: 4.8,
        badge: 'Chef Special',
        img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop&q=80',
        veg: 'non-veg',
        available: true,
        discountPrice: null,
        sizes: [],
        extras: [{ name: 'Extra Lemon Butter', price: 80 }]
    }, {
        id: 15,
        name: 'Beef Steak',
        desc: 'Prime cut grilled to perfection with red wine jus.',
        price: 1850,
        category: 'Main Course',
        popular: false,
        rating: 4.9,
        badge: 'Signature',
        img: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop&q=80',
        veg: 'non-veg',
        available: true,
        discountPrice: null,
        sizes: [],
        extras: [{ name: 'Extra Mushroom Sauce', price: 120 }, { name: 'Extra Fries', price: 150 }]
    }, {
        id: 16,
        name: 'Iced Tea',
        desc: 'Refreshing brewed iced tea with a hint of lemon.',
        price: 250,
        category: 'Drinks',
        popular: false,
        rating: 4.3,
        badge: null,
        img: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=400&h=300&fit=crop&q=80',
        veg: 'veg',
        available: true,
        discountPrice: null,
        sizes: [{ name: 'Regular', price: 250 }, { name: 'Large', price: 350 }],
        extras: []
    }, {
        id: 17,
        name: 'Fresh Orange Juice',
        desc: 'Freshly squeezed orange juice, served chilled.',
        price: 300,
        category: 'Drinks',
        popular: false,
        rating: 4.4,
        badge: null,
        img: 'https://images.unsplash.com/photo-1600271886742-f049ced6014c?w=400&h=300&fit=crop&q=80',
        veg: 'veg',
        available: true,
        discountPrice: null,
        sizes: [{ name: 'Regular', price: 300 }, { name: 'Large', price: 420 }],
        extras: []
    }, {
        id: 18,
        name: 'Tiramisu',
        desc: 'Classic Italian coffee-flavoured layered dessert.',
        price: 650,
        category: 'Desserts',
        popular: false,
        rating: 4.7,
        badge: null,
        img: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop&q=80',
        veg: 'veg',
        available: true,
        discountPrice: null,
        sizes: [],
        extras: []
    }, {
        id: 19,
        name: 'Ice Cream Trio',
        desc: 'Three scoops of premium vanilla, chocolate & strawberry.',
        price: 450,
        category: 'Desserts',
        popular: false,
        rating: 4.5,
        badge: null,
        img: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400&h=300&fit=crop&q=80',
        veg: 'veg',
        available: true,
        discountPrice: null,
        sizes: [],
        extras: [{ name: 'Extra Toppings', price: 60 }]
    }, {
        id: 20,
        name: 'Crispy Calamari',
        desc: 'Lightly battered calamari with garlic aioli dip.',
        price: 500,
        category: 'Starters',
        popular: false,
        rating: 4.4,
        badge: null,
        img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop&q=80',
        veg: 'non-veg',
        available: true,
        discountPrice: null,
        sizes: [],
        extras: [{ name: 'Extra Dip', price: 50 }]
    }, {
        id: 21,
        name: 'Loaded Nachos',
        desc: 'Crispy tortilla chips with cheese, salsa & guacamole.',
        price: 600,
        category: 'Starters',
        popular: false,
        rating: 4.5,
        badge: null,
        img: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=300&fit=crop&q=80',
        veg: 'veg',
        available: true,
        discountPrice: null,
        sizes: [{ name: 'Regular', price: 600 }, { name: 'Large', price: 850 }],
        extras: [{ name: 'Extra Cheese', price: 100 }, { name: 'Extra Jalapenos', price: 50 }]
    }];

    function read(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw === null ? fallback : JSON.parse(raw);
        } catch (err) {
            console.error('GTStore: failed to read', key, err);
            return fallback;
        }
    }

    function write(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function seed() {
        if (localStorage.getItem(KEYS.categories) === null) write(KEYS.categories, DEFAULT_CATEGORIES);
        if (localStorage.getItem(KEYS.products) === null) write(KEYS.products, DEFAULT_PRODUCTS);
        if (localStorage.getItem(KEYS.tables) === null) write(KEYS.tables, []);
        if (localStorage.getItem(KEYS.waiterCalls) === null) write(KEYS.waiterCalls, []);
    }
    seed();

    return {
        KEYS,

        getCategories() { return read(KEYS.categories, DEFAULT_CATEGORIES); },
        saveCategories(list) { write(KEYS.categories, list); },

        getProducts() { return read(KEYS.products, DEFAULT_PRODUCTS); },
        saveProducts(list) { write(KEYS.products, list); },

        async getOrders() {
            if (!supabaseClient) return readLocalOrders();
            const { data, error } = await supabaseClient.from('orders').select('*').order('created_at', { ascending: false });
            if (error) {
                console.error('GTStore: failed to fetch orders from Supabase', error);
                return readLocalOrders();
            }
            return data.map(mapOrderRow);
        },

        async addOrder(order) {
            if (!supabaseClient) {
                const local = readLocalOrders();
                const saved = { ...order, id: order.id || nextLocalOrderId() };
                local.unshift(saved);
                writeLocalOrders(local);
                return saved;
            }
            const { data, error } = await supabaseClient.from('orders').insert(toOrderRow(order)).select().single();
            if (error) {
                console.error('GTStore: failed to save order to Supabase', error);
                throw error;
            }
            return mapOrderRow(data);
        },

        async updateOrderStatus(id, status) {
            if (!supabaseClient) {
                const local = readLocalOrders();
                const next = local.map(o => o.id === id ? { ...o, status } : o);
                writeLocalOrders(next);
                return next.find(o => o.id === id) || null;
            }
            const { data, error } = await supabaseClient.from('orders').update({ status }).eq('id', id).select().single();
            if (error) {
                console.error('GTStore: failed to update order status in Supabase', error);
                return null;
            }
            return mapOrderRow(data);
        },

        subscribeToOrders(callback) {
            if (!supabaseClient) return null;
            return supabaseClient
                .channel('gt-orders-changes')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
                    const row = (payload.new && Object.keys(payload.new).length) ? payload.new : payload.old;
                    callback({ eventType: payload.eventType, order: mapOrderRow(row) });
                })
                .subscribe();
        },

        nextProductId(products) {
            const list = products || read(KEYS.products, DEFAULT_PRODUCTS);
            return list.reduce((max, p) => Math.max(max, p.id), 0) + 1;
        },

        getTables() { return read(KEYS.tables, []); },
        saveTables(list) { write(KEYS.tables, list); },

        nextTableId(tables) {
            const list = tables || read(KEYS.tables, []);
            return list.reduce((max, t) => Math.max(max, t.id), 0) + 1;
        },

        getWaiterCalls() { return read(KEYS.waiterCalls, []); },
        saveWaiterCalls(list) { write(KEYS.waiterCalls, list); },

        addWaiterCall(call) {
            const list = read(KEYS.waiterCalls, []);
            list.unshift(call);
            write(KEYS.waiterCalls, list);
            return call;
        },

        resolveWaiterCall(id) {
            const list = read(KEYS.waiterCalls, []);
            const next = list.map(c => c.id === id ? { ...c, status: 'resolved' } : c);
            write(KEYS.waiterCalls, next);
            return next.find(c => c.id === id) || null;
        },

        nextWaiterCallId(list) {
            const l = list || read(KEYS.waiterCalls, []);
            return l.reduce((max, c) => Math.max(max, c.id), 0) + 1;
        }
    };
})();
