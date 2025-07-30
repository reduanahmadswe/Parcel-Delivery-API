import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.routes';
import { parcelRoutes } from '../modules/parcel/parcel.routes';
import { userRoutes } from '../modules/user/user.routes';

const router = Router();

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

