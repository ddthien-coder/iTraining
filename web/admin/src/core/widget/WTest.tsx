import { BeanObserver } from 'core/entity';
import { WComponent, WComponentProps } from './WLayout';

export type TestEntityOnModify = (bean: any, field: string, oldVal: any, newVal: any) => void

export interface WTestEntityProps extends WComponentProps {
  observer: BeanObserver;
  onModify?: TestEntityOnModify
}
export class WTestEntity<T extends WTestEntityProps = WTestEntityProps> extends WComponent<T> { 
}

export interface WTestEntityProps extends WComponentProps {
  observer: BeanObserver;
  onModify?: TestEntityOnModify
}
export class UITestEntity <T extends WTestEntityProps = WTestEntityProps, S = any> extends WComponent<T, S> { 

}
