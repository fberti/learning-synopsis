# 12.3 kvíz (ai12-123) – számok ellenőrzése
import math
def run(xs, w=0.5, tanh=True):
    h = 0.0; out = []
    for x in xs:
        z = w*h + x
        h = math.tanh(z) if tanh else z
        out.append(h)
    return out
print("Q3 unalmas jó", run([-1, 1]))
print("Q3 no 0.5 factor", run([-1, 1], w=1.0))
h1 = math.tanh(-1); print("Q3 no tanh on step2", 0.5*h1 + 1)
print("Q3 reversed jó unalmas", run([1, -1]))
d, h = 32, 64
rnn = d*h + h*h + h
print("Q4", rnn, d*h + h*h, d*h + h, rnn*10)
print("Q6", 1.2**10, 1.2*10, 1 + 0.2*10, 0.8**10)
print("Q7", 4*rnn, 3*rnn, 4*(d*h + h*h))
# magyarázatokhoz: a kiinduló példa
print("ex", run([1, 0, -1]), run([-1, 0, 1]))
