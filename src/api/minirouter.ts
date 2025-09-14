import { Router, Request, Response } from 'express';

const router = Router();
// 501 helpers for planned surfaces
const notImplemented = (resource: string) => (req: Request, res: Response) => {
  res.status(501).json({
    error: 'NotImplemented',
    message: `${resource} endpoints are not implemented yet`,
    timestamp: new Date().toISOString()
  });
};

router.all('/patients*', notImplemented('patients'));
router.all('/analysis*', notImplemented('analysis'));
router.all('/treatments*', notImplemented('treatments'));
router.all('/admin*', notImplemented('admin'));
router.all('/monitoring*', notImplemented('monitoring'));

export default router;
