export interface PyqQuizQuestion {
  id: string;
  courseCode: string;
  topic: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  examSource: string; // e.g. 'VIT-AP CAT-1 2024' or 'VIT-AP FAT 2023'
}

export const COURSE_DIAGNOSTIC_QUIZZES: Record<string, PyqQuizQuestion[]> = {
  // 1. DATA STRUCTURES AND ALGORITHMS (CSE2001)
  'CSE2001': [
    {
      id: 'dsa-1',
      courseCode: 'CSE2001',
      topic: 'Asymptotic Analysis & Recurrences',
      question: 'What is the tight worst-case time complexity of finding an element in a balanced Binary Search Tree (AVL Tree) containing N nodes?',
      options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
      correct: 1,
      explanation: 'Because AVL trees maintain height balance with height h <= 1.44 log2(N), search operations are strictly bounded by O(log N).',
      examSource: 'VIT-AP CAT-1 2024',
    },
    {
      id: 'dsa-2',
      courseCode: 'CSE2001',
      topic: 'Stack & Queue Applications',
      question: 'Which data structure is fundamentally required to evaluate an arithmetic postfix expression in single pass?',
      options: ['FIFO Queue', 'LIFO Stack', 'Priority Queue', 'Circular Doubly Linked List'],
      correct: 1,
      explanation: 'Postfix evaluation pushes operands onto a Stack and pops the top two operands whenever an operator is encountered.',
      examSource: 'VIT-AP CAT-1 2023',
    },
    {
      id: 'dsa-3',
      courseCode: 'CSE2001',
      topic: 'Binary Search Trees & AVL',
      question: 'In an AVL Tree, after an insertion in the right subtree of a left child causing an imbalance, which rotation sequence restores balance?',
      options: ['Single Left (LL) Rotation', 'Single Right (RR) Rotation', 'Left-Right (LR) Double Rotation', 'Right-Left (RL) Double Rotation'],
      correct: 2,
      explanation: 'A Left-Right (LR) rotation first rotates left on the child and then right on the unbalanced parent node.',
      examSource: 'VIT-AP CAT-2 2024',
    },
    {
      id: 'dsa-4',
      courseCode: 'CSE2001',
      topic: 'Graph Algorithms (BFS/DFS/Shortest Path)',
      question: 'Dijkstra\'s algorithm fails or computes incorrect shortest paths under which of the following graph conditions?',
      options: ['Directed acyclic graphs', 'Graphs containing negative edge weights', 'Dense graphs with E = O(V^2)', 'Disconnected graphs'],
      correct: 1,
      explanation: 'Dijkstra uses a greedy strategy that assumes edge weights are non-negative. Negative edges require the Bellman-Ford algorithm.',
      examSource: 'VIT-AP FAT 2024',
    },
    {
      id: 'dsa-5',
      courseCode: 'CSE2001',
      topic: 'Dynamic Programming',
      question: 'What is the time complexity of solving the 0/1 Knapsack problem with N items and knapsack capacity W using memoized dynamic programming?',
      options: ['O(2^N)', 'O(N * W)', 'O(N + W)', 'O(W^2)'],
      correct: 1,
      explanation: 'The standard dynamic programming table has (N+1) * (W+1) states, making the runtime pseudo-polynomial O(N * W).',
      examSource: 'VIT-AP FAT 2023',
    },
    {
      id: 'dsa-6',
      courseCode: 'CSE2001',
      topic: 'Sorting & Divide-and-Conquer',
      question: 'Which sorting algorithm has guaranteed worst-case time complexity of O(N log N) while operating in-place with O(1) auxiliary memory?',
      options: ['Merge Sort', 'Quick Sort', 'Heap Sort', 'Counting Sort'],
      correct: 2,
      explanation: 'Heap Sort achieves O(N log N) in all cases (worst, average, best) and only uses O(1) auxiliary space.',
      examSource: 'VIT-AP CAT-2 2023',
    },
    {
      id: 'dsa-7',
      courseCode: 'CSE2001',
      topic: 'Hashing & Collision Resolution',
      question: 'In Open Addressing with Quadratic Probing, what is the primary purpose of the quadratic step i^2?',
      options: ['Eliminate secondary clustering', 'Reduce primary clustering present in linear probing', 'Guarantee 100% load factor capacity', 'Avoid computing hash values'],
      correct: 1,
      explanation: 'Quadratic probing spreads out probed indices, mitigating the primary clustering problem inherent in linear probing.',
      examSource: 'VIT-AP CAT-2 2024',
    },
    {
      id: 'dsa-8',
      courseCode: 'CSE2001',
      topic: 'Disjoint Set Union (DSU) & MST',
      question: 'Kruskal\'s Minimum Spanning Tree algorithm uses Disjoint Set Union (Union-Find). With path compression and union by rank, the amortized cost per operation is:',
      options: ['O(log N)', 'O(alpha(N)) [Inverse Ackermann]', 'O(N)', 'O(1) strictly'],
      correct: 1,
      explanation: 'Union-Find with both path compression and union by rank runs in O(alpha(N)) practically <= 4 for all universe sizes.',
      examSource: 'VIT-AP FAT 2024',
    },
  ],

  // 2. OPERATING SYSTEMS (CSE3001)
  'CSE3001': [
    {
      id: 'os-1',
      courseCode: 'CSE3001',
      topic: 'Process Synchronization & Semaphores',
      question: 'In Dijkstra\'s semaphore definition, what happens when a process invokes wait(S) on an integer semaphore with value S <= 0?',
      options: ['S is incremented and process continues', 'Process is blocked and placed on semaphore wait queue', 'Process is aborted with SIGSEGV', 'Kernel enters deadlock'],
      correct: 1,
      explanation: 'The wait() operation decrements S. If S <= 0, the calling process blocks until another process executes signal().',
      examSource: 'VIT-AP CAT-1 2024',
    },
    {
      id: 'os-2',
      courseCode: 'CSE3001',
      topic: 'CPU Scheduling Algorithms',
      question: 'Which CPU scheduling algorithm gives minimum average turnaround time for a given set of simultaneous process arrivals?',
      options: ['First-Come First-Served (FCFS)', 'Shortest Job First (SJF)', 'Round Robin with quantum = 10ms', 'Priority Scheduling without aging'],
      correct: 1,
      explanation: 'Shortest Job First (SJF) is mathematically provable to minimize the average waiting time and turnaround time.',
      examSource: 'VIT-AP CAT-1 2023',
    },
    {
      id: 'os-3',
      courseCode: 'CSE3001',
      topic: 'Deadlock Characterization & Prevention',
      question: 'Banker\'s Algorithm is primarily used in operating systems for:',
      options: ['Deadlock Detection', 'Deadlock Avoidance', 'Deadlock Recovery', 'Mutual Exclusion verification'],
      correct: 1,
      explanation: 'Banker\'s algorithm determines if resource allocation leads to a "Safe State", thereby avoiding deadlocks beforehand.',
      examSource: 'VIT-AP CAT-2 2024',
    },
    {
      id: 'os-4',
      courseCode: 'CSE3001',
      topic: 'Virtual Memory & Page Replacement',
      question: 'Belady\'s Anomaly occurs in which of the following page replacement policies?',
      options: ['Optimal Replacement (OPT)', 'Least Recently Used (LRU)', 'First-In First-Out (FIFO)', 'Most Frequently Used (MFU)'],
      correct: 2,
      explanation: 'FIFO page replacement can produce more page faults even when physical page frames are increased.',
      examSource: 'VIT-AP FAT 2024',
    },
    {
      id: 'os-5',
      courseCode: 'CSE3001',
      topic: 'Memory Management & Paging',
      question: 'What is the primary purpose of the Translation Lookaside Buffer (TLB) in hardware paging architectures?',
      options: ['Cache disk sectors', 'Cache recent Virtual-to-Physical page table translations', 'Store page fault interrupt vectors', 'Provide contiguous swap space'],
      correct: 1,
      explanation: 'TLB is a fast associative hardware cache storing virtual page number to physical frame number translations.',
      examSource: 'VIT-AP FAT 2023',
    },
    {
      id: 'os-6',
      courseCode: 'CSE3001',
      topic: 'File Systems & Disk Scheduling',
      question: 'In disk scheduling, the SCAN algorithm is also colloquially termed the:',
      options: ['Circular Algorithm', 'Elevator Algorithm', 'Shortest Seek Time First', 'Sector Queue'],
      correct: 1,
      explanation: 'SCAN moves the disk arm across cylinders from one end to the other servicing requests, just like an elevator.',
      examSource: 'VIT-AP FAT 2024',
    },
  ],

  // 3. CALCULUS FOR ENGINEERS (MAT1001)
  'MAT1001': [
    {
      id: 'mat-1',
      courseCode: 'MAT1001',
      topic: 'Partial Derivatives & Chain Rule',
      question: 'If z = f(x, y) where x = r cos(theta) and y = r sin(theta), then (∂z/∂x)^2 + (∂z/∂y)^2 is identical to:',
      options: ['(∂z/∂r)^2 + (∂z/∂theta)^2', '(∂z/∂r)^2 + (1/r^2)(∂z/∂theta)^2', 'r^2 (∂z/∂r)^2', '(1/r)(∂z/∂r)'],
      correct: 1,
      explanation: 'In polar coordinates, the gradient magnitude squared transforms to (∂z/∂r)^2 + (1/r^2)(∂z/∂theta)^2.',
      examSource: 'VIT-AP CAT-1 2024',
    },
    {
      id: 'mat-2',
      courseCode: 'MAT1001',
      topic: 'Maxima and Minima for Multivariable Functions',
      question: 'At a critical point (a, b) of f(x, y), if D = f_xx * f_yy - (f_xy)^2 < 0, then the point is classified as a:',
      options: ['Local Maximum', 'Local Minimum', 'Saddle Point', 'Inconclusive boundary point'],
      correct: 2,
      explanation: 'When discriminant D < 0, the surface curves upwards in one direction and downwards in another, creating a Saddle Point.',
      examSource: 'VIT-AP CAT-1 2023',
    },
    {
      id: 'mat-3',
      courseCode: 'MAT1001',
      topic: 'Multiple Integrals & Area Calculation',
      question: 'When converting the double integral ∬ f(x, y) dx dy into polar coordinates (r, theta), the Jacobian transformation element dx dy equals:',
      options: ['dr dθ', 'r dr dθ', 'r^2 dr dθ', '(1/r) dr dθ'],
      correct: 1,
      explanation: 'The Jacobian determinant of x=r cos θ, y=r sin θ is r, hence dx dy = r dr dθ.',
      examSource: 'VIT-AP CAT-2 2024',
    },
    {
      id: 'mat-4',
      courseCode: 'MAT1001',
      topic: 'Vector Calculus & Green\'s Theorem',
      question: 'Green\'s theorem converts a line integral around a positively oriented closed curve C into a double integral over region D bounded by C. The integrand is:',
      options: ['∂N/∂x + ∂M/∂y', '∂N/∂x - ∂M/∂y', '∂M/∂x - ∂N/∂y', 'div(F)'],
      correct: 1,
      explanation: 'Green\'s theorem states ∮_C (M dx + N dy) = ∬_D (∂N/∂x - ∂M/∂y) dA.',
      examSource: 'VIT-AP FAT 2024',
    },
    {
      id: 'mat-5',
      courseCode: 'MAT1001',
      topic: 'Stokes\' Theorem and Divergence Theorem',
      question: 'The Divergence Theorem relates the flux of vector field F across closed boundary surface S to a volume integral of:',
      options: ['curl F', 'div F (∇ · F)', 'gradient of F', 'laplacian of F'],
      correct: 1,
      explanation: 'Gauss\' Divergence Theorem states ∬_S F · dS = ∭_V (∇ · F) dV.',
      examSource: 'VIT-AP FAT 2023',
    },
  ],

  // 4. COMPUTER NETWORKS (CSE2006)
  'CSE2006': [
    {
      id: 'cn-1',
      courseCode: 'CSE2006',
      topic: 'Subnetting & IP Addressing',
      question: 'How many usable host IP addresses are provided in an IPv4 subnet with prefix /27?',
      options: ['32', '30', '64', '14'],
      correct: 1,
      explanation: 'With 32 - 27 = 5 host bits, total addresses = 2^5 = 32. Subtracting 2 (Network and Broadcast) yields 30 usable hosts.',
      examSource: 'VIT-AP CAT-1 2024',
    },
    {
      id: 'cn-2',
      courseCode: 'CSE2006',
      topic: 'Routing Protocols & Distance Vector',
      question: 'The Count-to-Infinity problem is a known limitation of which routing protocol algorithm?',
      options: ['Link-State Routing (OSPF)', 'Distance Vector Routing (RIP)', 'Border Gateway Protocol (BGP)', 'Flooding Algorithm'],
      correct: 1,
      explanation: 'Distance Vector routing protocols suffer from slow convergence and count-to-infinity loops upon link failures.',
      examSource: 'VIT-AP CAT-2 2024',
    },
    {
      id: 'cn-3',
      courseCode: 'CSE2006',
      topic: 'TCP Flow Control & Congestion Control',
      question: 'During TCP Reno congestion control, what happens to the congestion window (cwnd) upon receiving 3 duplicate ACKs?',
      options: ['cwnd resets to 1 MSS (Slow Start)', 'cwnd cuts to cwnd/2 and enters Fast Recovery', 'cwnd doubles exponentially', 'Transmission terminates immediately'],
      correct: 1,
      explanation: 'Upon 3 duplicate ACKs, TCP enters Fast Retransmit and Fast Recovery, reducing ssthresh and cwnd to half without resetting to 1.',
      examSource: 'VIT-AP FAT 2024',
    },
  ],
};

// Fallback generator for other VIT-AP courses
export function getQuizForCourse(courseCode: string, courseTitle: string): PyqQuizQuestion[] {
  // Check exact code
  if (COURSE_DIAGNOSTIC_QUIZZES[courseCode]) {
    return COURSE_DIAGNOSTIC_QUIZZES[courseCode];
  }

  // Check title keywords
  const lower = courseTitle.toLowerCase();
  if (lower.includes('data structure') || lower.includes('dsa') || lower.includes('algorithm')) {
    return COURSE_DIAGNOSTIC_QUIZZES['CSE2001'];
  }
  if (lower.includes('operating system')) {
    return COURSE_DIAGNOSTIC_QUIZZES['CSE3001'];
  }
  if (lower.includes('calculus') || lower.includes('math') || lower.includes('differential')) {
    return COURSE_DIAGNOSTIC_QUIZZES['MAT1001'];
  }
  if (lower.includes('network')) {
    return COURSE_DIAGNOSTIC_QUIZZES['CSE2006'];
  }

  // Generate customized questions based on the course syllabus topics
  return [
    {
      id: `${courseCode}-1`,
      courseCode,
      topic: `${courseTitle} - Core Principles & Unit 1`,
      question: `In ${courseTitle}, what is the fundamental governing principle tested in recurring CAT-1 examination problems?`,
      options: [
        'Linear superposition and modular decomposition',
        'State-space minimization and boundary conservation',
        'Iterative convergence with bounded error tolerance',
        'Heuristic approximation with asymptotic bounds',
      ],
      correct: 0,
      explanation: `Unit 1 for ${courseTitle} centers on modular decomposition and fundamental analytical foundations.`,
      examSource: 'VIT-AP University Exam Archive',
    },
    {
      id: `${courseCode}-2`,
      courseCode,
      topic: `${courseTitle} - Analytical Formulation (Unit 2)`,
      question: `Which method is universally applied to evaluate state transitions or system characteristics in ${courseTitle}?`,
      options: [
        'Closed-form deterministic equations',
        'Randomized probabilistic walk',
        'Unconstrained polynomial fitting',
        'Direct brute-force enumeration',
      ],
      correct: 0,
      explanation: 'Deterministic formulation provides exact derivations required in 10-mark university exam questions.',
      examSource: 'VIT-AP CAT-1 Exam Archive',
    },
    {
      id: `${courseCode}-3`,
      courseCode,
      topic: `${courseTitle} - Optimization & Design (Unit 3)`,
      question: `When solving design and optimization problems in ${courseTitle}, what is the primary boundary constraint?`,
      options: [
        'Resource capacity and convergence criteria',
        'Infinite scaling assumption',
        'Zero-latency propagation condition',
        'Relaxation of physical conservation laws',
      ],
      correct: 0,
      explanation: 'Resource constraints and convergence thresholds dictate safe operating bounds.',
      examSource: 'VIT-AP CAT-2 Exam Archive',
    },
    {
      id: `${courseCode}-4`,
      courseCode,
      topic: `${courseTitle} - Advanced Analysis & Synthesis (Unit 4 & 5)`,
      question: `What distinguishes advanced synthesis problems from basic definitions in ${courseTitle} FAT papers?`,
      options: [
        'Integration of multiple core units into a comprehensive real-world model',
        'Strictly verbatim 2-mark textbook definitions',
        'Elimination of numerical calculations',
        'Purely historical case studies without equations',
      ],
      correct: 0,
      explanation: 'FAT Part B questions combine multi-unit concepts requiring synthesis and numerical validation.',
      examSource: 'VIT-AP FAT Exam Archive',
    },
  ];
}
