export type Type = any;
export type Key = any;
export type Ref = any;
export type Props = any;
export type ElementType = any;

export interface ReactElementType {
	$$typeof: symbol | number;
	key: Key;
	ref: Ref;
	type: ElementType;
	props: Props;
	__mark: string;
}
