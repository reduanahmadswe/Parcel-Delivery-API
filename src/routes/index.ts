import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.routes';
import { parcelRoutes } from '../modules/parcel/parcel.routes';
import { userRoutes } from '../modules/user/user.routes';

const router = Router();

// API Welcome endpoint
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to Parcel Delivery API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            parcels: '/api/parcels',
        },
        documentation: 'https://github.com/reduanahmadswe/Parcel-Delivery-API',
        timestamp: new Date().toISOString(),
    });
});

// Module routes
const moduleRoutes = [
    {
        path: '/auth',
        route: authRoutes,
    },
    {
        path: '/users',
        route: userRoutes,
    },
    {
        path: '/parcels',
        route: parcelRoutes,
    },
];

// Register all module routes
moduleRoutes.forEach((moduleRoute) => {
    router.use(moduleRoute.path, moduleRoute.route);
});

export { router };

