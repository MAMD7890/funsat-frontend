import { animate, query, style, transition, trigger } from '@angular/animations';

/**
 * Solo anima la entrada de la vista nueva (sin :leave) para evitar que la
 * vista saliente y la entrante convivan superpuestas -habria que forzar
 * position:absolute en el contenedor y arriesgar saltos de layout-. La
 * vista anterior se retira de forma instantanea, como ya hacia el router
 * antes de esto.
 */
export const routeFadeAnimation = trigger('routeAnimations', [
  transition('* => *', [
    query(':enter', [style({ opacity: 0, transform: 'translateY(8px)' })], { optional: true }),
    query(':enter', [animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))], { optional: true })
  ])
]);
