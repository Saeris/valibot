export const assign = <
  TFunction extends (...args: any[]) => unknown,
  TProps extends object
>(
  fn: TFunction,
  props: TProps
): TFunction & TProps => {
  Object.entries(props).forEach(
    ([key, value]) =>
      // @ts-ignore
      (fn[key] = value)
  );
  return fn as TFunction & TProps;
};
