export type MulterFileFilterCallback = (exception: Error | null, acceptFile: boolean) => void

export type MulterFile = Express.Multer.File

export type MulterFileFilter = (
  req: Request,
  file: MulterFile,
  callback: MulterFileFilterCallback
) => void
