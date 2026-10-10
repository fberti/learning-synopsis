import torch
x = torch.tensor([1., 2.]); y = torch.tensor(1.)
W1 = torch.tensor([[0.5, 0.25], [-1., 1.]], requires_grad=True)
b1 = torch.tensor([0., 0.5], requires_grad=True)
w2 = torch.tensor([1., -1.], requires_grad=True)
b2 = torch.tensor(0.5, requires_grad=True)

h = torch.relu(W1 @ x + b1)                     # előre menet: a gráf közben épül
z2 = w2 @ h + b2
loss = torch.nn.functional.binary_cross_entropy_with_logits(z2, y)
loss.backward()                                 # visszafelé menet: fordított mód
print(loss.item())                              # 0.6931…
print(W1.grad)                                  # [[-0.5, -1.0], [0.5, 1.0]]
print(b1.grad, w2.grad, b2.grad)                # [-0.5, 0.5] [-0.5, -0.75] -0.5
