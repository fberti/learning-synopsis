# a tananyag néhány, a brief-ben nem rögzített számának ellenőrzése
from scipy.stats import poisson
print("ER blog P(K>=100)*1222 =", poisson.sf(99, 27.4)*1222)
print("Poisson(10) p20/p10 =", poisson.pmf(20,10)/poisson.pmf(10,10), " p40/p20 =", poisson.pmf(40,10)/poisson.pmf(20,10))
print("vegyes: 435*0.05 =", 435*0.05, " 29*0.05 =", 29*0.05, " C(8,3)*0.001 =", 56*0.001, " 15/80 =", 15/80)
