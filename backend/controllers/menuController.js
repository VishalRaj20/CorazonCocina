import Menu from '../models/Menu.js';

// @desc    Fetch all menu items
// @route   GET /api/menu
// @access  Public
export const getMenus = async (req, res) => {
    try {
        const menus = await Menu.find({});
        res.json(menus);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a menu item
// @route   POST /api/menu
// @access  Private/Admin
export const createMenu = async (req, res) => {
    try {
        const { name, category, description, price, image, isVegetarian, isVegan, available } = req.body;

        const menu = new Menu({
            name,
            category,
            description,
            price,
            image,
            isVegetarian,
            isVegan,
            available
        });

        const createdMenu = await menu.save();
        res.status(201).json(createdMenu);
    } catch (error) {
        res.status(400).json({ message: 'Invalid menu data' });
    }
};

// @desc    Update a menu item
// @route   PUT /api/menu/:id
// @access  Private/Admin
export const updateMenu = async (req, res) => {
    try {
        const { name, category, description, price, image, isVegetarian, isVegan, available } = req.body;

        const menu = await Menu.findById(req.params.id);

        if (menu) {
            menu.name = name || menu.name;
            menu.category = category || menu.category;
            menu.description = description || menu.description;
            menu.price = price || menu.price;
            menu.image = image || menu.image;
            menu.isVegetarian = isVegetarian !== undefined ? isVegetarian : menu.isVegetarian;
            menu.isVegan = isVegan !== undefined ? isVegan : menu.isVegan;
            menu.available = available !== undefined ? available : menu.available;

            const updatedMenu = await menu.save();
            res.json(updatedMenu);
        } else {
            res.status(404).json({ message: 'Menu not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
};

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
export const deleteMenu = async (req, res) => {
    try {
        const menu = await Menu.findById(req.params.id);

        if (menu) {
            await menu.deleteOne();
            res.json({ message: 'Menu removed' });
        } else {
            res.status(404).json({ message: 'Menu not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
