# gh7-72 kvíz számainak ellenőrzése
import math, networkx as nx
# 1. sigma
C, Ce, L, Le = 0.4, 0.02, 3.3, 3.0
print("Q1 sigma", (C/Ce)/(L/Le), "csak C", C/Ce, "szoroz", (C/Ce)*(L/Le), "fordított", (L/Le)/(C/Ce))
# 2. Milgram
print("Q2 arány", 64/296, 1-64/296)
# 3. gyűrűrács C, k=8 (képlet és networkx)
f = lambda k: 3*(k-2)/(4*(k-1))
G = nx.watts_strogatz_graph(100, 8, 0)
print("Q3 C k=8", f(8), nx.average_clustering(G), "(k-2)/(k-1)", 6/7, "k=4", f(4), "lim", 0.75)
# 4. L, n=2000, k=10
G = nx.watts_strogatz_graph(2000, 10, 0)
print("Q4 n/2k", 2000/20, "pontos", nx.average_shortest_path_length(G), "n/k", 200, "ER", math.log(2000)/math.log(10), "ln n", math.log(2000))
# szöveg: 8 csúcs k=4, 12 csúcs k=4 és az átkötés, kis esetek
G8 = nx.watts_strogatz_graph(8, 4, 0); print("txt 8: C", nx.average_clustering(G8), "L", nx.average_shortest_path_length(G8), 10/7)
G12 = nx.watts_strogatz_graph(12, 4, 0); print("txt 12: C", nx.average_clustering(G12), "L", nx.average_shortest_path_length(G12), 21/11)
G12.remove_edge(0,1); G12.add_edge(0,6)
print("txt 12 átkötve: C", round(nx.average_clustering(G12),3), "L", round(nx.average_shortest_path_length(G12),3))
print("txt C6 L", nx.average_shortest_path_length(nx.cycle_graph(6)), "k=6", f(6), "k=10", f(10), "k=2", f(2))
print("txt n=1000 k=10 L", nx.average_shortest_path_length(nx.watts_strogatz_graph(1000,10,0)))
print("txt Föld", math.log(8e9)/math.log(1000), math.log(8e9), math.log(1000), "karate sigma", (0.57/0.13)/(2.41/2.40))
print("txt prakt", 50**3, math.log(1e5)/math.log(10), (0.3/0.01)/(4.2/3.5), 0.73*0.667, 0.088*50.45, 0.997-0.54, 0.35-0.071, math.log(1000)/math.log(10)/50.45, 3.3/50.45)
