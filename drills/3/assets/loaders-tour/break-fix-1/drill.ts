// Compressed glTF setup: find the missing decoder registration.
export type CompressedLoader<D, M> = {
  setDRACOLoader(decoder: D): unknown;
  setMeshoptDecoder(decoder: M): unknown;
};

export function configureCompressed<D, M>(loader: CompressedLoader<D, M>, draco: D, meshopt: M): void {
  loader.setDRACOLoader(draco);
}
