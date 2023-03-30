from typing import List

class GradingScheme():
   
    def __init__(self, A: List[int] = [], B: List[int] = [], C: List[int] = [], D: List[int] = [], F: List[int] = []):
        self.A = A
        self.B = B
        self.C = C
        self.D = D
        self.F = F

        # TODO: make sure they are min length 1 and max length 2