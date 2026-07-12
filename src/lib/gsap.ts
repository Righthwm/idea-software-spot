import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

/** Shared "heavy premium" easing — cubic-bezier(0.76, 0, 0.24, 1) */
export const EASE_PREMIUM = 'cubic-bezier(0.76, 0, 0.24, 1)'
export const easePremium = gsap.parseEase('0.76, 0, 0.24, 1')

export { gsap, ScrollTrigger, SplitText }
