import { DOMAINS } from '../../../scripts/lib/domains.ts';
let t=0,core=0,light=0; for (const d of DOMAINS){ if(d.elective) continue; t+=d.concepts.length; core+=d.concepts.filter(c=>c.tier==='core').length; light+=d.concepts.filter(c=>c.tier==='light').length; console.log(d.n,d.concepts.length);} console.log('total',t,'core',core,'light',light);
