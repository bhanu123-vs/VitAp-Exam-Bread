// Generated Course Syllabus Database for ALL 57 VIT-AP Courses
// Ground-truth syllabus with modules, core topics, and exam-tailored weightages for CAT-1 (Units 1-2), CAT-2 (Units 3-4), and FAT (Units 1-5).

export interface CourseModuleDef {
  moduleNumber: number;
  name: string;
  coreTopics: string[];
  fatWeightage: number; // Course-specific weightage out of 100 for FAT
  cat1Weightage?: number; // Weightage for Unit 1 & 2 in CAT-1 (out of 50)
  cat2Weightage?: number; // Weightage for Unit 3 & 4 in CAT-2 (out of 50)
}

export const ALL_57_COURSES_SYLLABUS: Record<string, CourseModuleDef[]> = {
  // MAT1001: Calculus for Engineers
  MAT1001: [
    {
      moduleNumber: 1,
      name: "Differential Calculus & Curvature",
      coreTopics: ["Radius of Curvature (Cartesian & Polar)","Center of Curvature & Evolutes","Envelopes of Families of Curves","Taylor Theorem with Remainder"],
      fatWeightage: 16,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Functions of Several Variables",
      coreTopics: ["Partial Derivatives & Homogeneous Functions","Euler's Theorem on Homogeneous Functions","Taylor Series Expansion in Two Variables","Maxima, Minima & Lagrange Multipliers"],
      fatWeightage: 20,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Multiple Integrals & Coordinate Transforms",
      coreTopics: ["Double Integrals in Cartesian & Polar Coordinates","Change of Order of Integration","Triple Integrals in Cylindrical Coordinates","Volume & Surface Area of Solids"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Vector Differentiation & Gradient Fields",
      coreTopics: ["Gradient of Scalar Fields","Divergence and Curl of Vector Fields","Solenoidal and Irrotational Vectors","Directional Derivatives & Tangent Planes"],
      fatWeightage: 22,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Vector Integral Theorems",
      coreTopics: ["Green's Theorem in the Plane","Stoke's Curl Theorem Verification","Gauss Divergence Theorem","Physical Flux & Work Done Formulations"],
      fatWeightage: 18,
    },
  ],

  // MAT1002: Applications of Differential and Difference Equations
  MAT1002: [
    {
      moduleNumber: 1,
      name: "First Order Ordinary Differential Equations",
      coreTopics: ["Exact Differential Equations & Integrating Factors","Linear ODEs and Bernoulli Equations","Orthogonal Trajectories","Newton's Law of Cooling & Growth Models"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Higher Order Linear Differential Equations",
      coreTopics: ["Method of Undetermined Coefficients","Method of Variation of Parameters","Cauchy-Euler Equidimensional Equations","Simultaneous Linear Differential Equations"],
      fatWeightage: 22,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Laplace Transforms & Inversion",
      coreTopics: ["Transforms of Elementary & Periodic Functions","First and Second Shifting Theorems","Convolution Theorem & Inverse Laplace","Solving Initial Value Problems via Laplace"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Fourier Series & Harmonic Analysis",
      coreTopics: ["Dirichlet's Conditions & Half Range Expansions","Fourier Cosine and Sine Series","Parseval Identity & RMS Values","Harmonic Analysis of Discrete Data"],
      fatWeightage: 20,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Difference Equations & Z-Transforms",
      coreTopics: ["Formation and Solution of Linear Difference Equations","Z-Transform Definitions and Properties","Inverse Z-Transform via Partial Fractions","Application to Discrete Control Systems"],
      fatWeightage: 16,
    },
  ],

  // MAT1003: Discrete Mathematical Structures
  MAT1003: [
    {
      moduleNumber: 1,
      name: "Mathematical Logic & Proof Methods",
      coreTopics: ["Propositional Logic & Truth Tables","Tautology & Logical Equivalence","Predicates and Quantifiers","Methods of Proof & Mathematical Induction"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Set Theory, Relations & Functions",
      coreTopics: ["Set Identities & Cartesian Products","Equivalence Relations & Partitions","Partial Ordering Relations & Hasse Diagrams","Injective, Surjective & Bijective Functions"],
      fatWeightage: 20,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Algebraic Structures & Group Theory",
      coreTopics: ["Semigroups, Monoids and Groups","Subgroups & Cyclic Groups","Lagrange's Theorem & Cosets","Homomorphism and Isomorphism of Groups"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Combinatorics & Recurrence Relations",
      coreTopics: ["Permutations, Combinations & Pigeonhole Principle","Inclusion-Exclusion Principle","Solving Linear Homogeneous Recurrence Relations","Generating Functions for Sequences"],
      fatWeightage: 22,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Graph Theory & Trees",
      coreTopics: ["Eulerian and Hamiltonian Graphs","Planar Graphs & Euler Formula","Tree Traversals and Spanning Trees","Graph Coloring & Chromatic Numbers"],
      fatWeightage: 16,
    },
  ],

  // MAT1007: Discrete Mathematics
  MAT1007: [
    {
      moduleNumber: 1,
      name: "Logic, Rules of Inference & Quantifiers",
      coreTopics: ["Propositional Logic & Connectives","Rules of Inference & Fallacies","Nested Quantifiers","Mathematical Proof Techniques"],
      fatWeightage: 18,
      cat1Weightage: 25,
    },
    {
      moduleNumber: 2,
      name: "Relations, Posets & Lattices",
      coreTopics: ["Binary Relations & Closures","Equivalence Classes","Hasse Diagrams & Maximal/Minimal Elements","Lattices as Algebraic Systems"],
      fatWeightage: 20,
      cat1Weightage: 25,
    },
    {
      moduleNumber: 3,
      name: "Counting Principles & Recurrences",
      coreTopics: ["Pigeonhole Principle Applications","Permutations with Repetition","Solving Divide-and-Conquer Recurrences","Generating Functions & Catalan Numbers"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Graph Algorithms & Connectivity",
      coreTopics: ["Graph Representations & Isomorphism","Bipartite Graphs & Matching","Dijkstra and Prim/Kruskal Algorithms","Graph Traversals (BFS, DFS)"],
      fatWeightage: 22,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Boolean Algebra & Logic Circuits",
      coreTopics: ["Boolean Functions and Duality","Karnaugh Maps & SOP/POS Simplification","Logic Gate Networks","Finite State Automata Representations"],
      fatWeightage: 16,
    },
  ],

  // MAT1008: Fundamentals of Calculus
  MAT1008: [
    {
      moduleNumber: 1,
      name: "Limits, Continuity & Differentiation",
      coreTopics: ["Limit Theorems and Indeterminate Forms","Continuity & Intermediate Value Theorem","Chain Rule and Implicit Differentiation","Higher Order Derivatives & Leibniz Rule"],
      fatWeightage: 18,
      cat1Weightage: 25,
    },
    {
      moduleNumber: 2,
      name: "Mean Value Theorems & Curves",
      coreTopics: ["Rolle's Theorem & Lagrange MVT","Cauchy's Mean Value Theorem","Taylor and Maclaurin Polynomials","Asymptotes and Curve Tracing"],
      fatWeightage: 20,
      cat1Weightage: 25,
    },
    {
      moduleNumber: 3,
      name: "Definite & Improper Integrals",
      coreTopics: ["Fundamental Theorem of Calculus","Reduction Formulas for Trigonometric Powers","Improper Integrals of First and Second Kind","Beta and Gamma Functions and Properties"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Applications of Integration",
      coreTopics: ["Area Between Curves in Rectangular Coordinates","Arc Length of Curves","Volumes of Revolution (Disk and Shell Methods)","Surface Area of Solids of Revolution"],
      fatWeightage: 22,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Infinite Series & Convergence Tests",
      coreTopics: ["Sequences & Boundedness","Geometric and p-Series","Ratio, Root, and Integral Comparison Tests","Alternating Series & Leibniz Test"],
      fatWeightage: 16,
    },
  ],

  // MAT1009: Applied Linear Algebra
  MAT1009: [
    {
      moduleNumber: 1,
      name: "Systems of Linear Equations & Matrices",
      coreTopics: ["Gaussian Elimination & Row Echelon Forms","Rank of Matrix and Consistency Analysis","Homogeneous & Non-Homogeneous Systems","LU Decomposition and Inverses"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Vector Spaces & Subspaces",
      coreTopics: ["Vector Space Axioms & Subspaces","Linear Independence and Spanning Sets","Basis and Dimension of Vector Spaces","Four Fundamental Subspaces of Matrix"],
      fatWeightage: 22,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Linear Transformations & Matrices",
      coreTopics: ["Kernel and Range (Rank-Nullity Theorem)","Matrix Representation of Linear Transformations","Change of Basis and Similarity","Orthogonal Transformations and Rotations"],
      fatWeightage: 22,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Inner Product Spaces & Orthogonality",
      coreTopics: ["Inner Products, Norms, and Cauchy-Schwarz","Orthogonal and Orthonormal Bases","Gram-Schmidt Orthogonalization Process","QR Decomposition and Least Squares Solutions"],
      fatWeightage: 22,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Eigenvalues, Diagonalization & SVD",
      coreTopics: ["Characteristic Polynomial and Eigenspaces","Diagonalization of Symmetric Matrices","Quadratic Forms and Definiteness","Singular Value Decomposition (SVD) and PCA"],
      fatWeightage: 16,
    },
  ],

  // MAT1011: Applied Statistics
  MAT1011: [
    {
      moduleNumber: 1,
      name: "Descriptive Statistics & Exploratory Data Analysis",
      coreTopics: ["Measures of Central Tendency & Dispersion","Moments, Skewness and Kurtosis","Covariance and Pearson Correlation","Linear Regression and Least Squares Line"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Probability & Discrete Distributions",
      coreTopics: ["Axioms of Probability & Bayes Theorem","Random Variables & Expectation","Binomial and Poisson Distributions","Hypergeometric and Geometric Distributions"],
      fatWeightage: 22,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Continuous Probability Distributions",
      coreTopics: ["Uniform and Exponential Distributions","Normal Distribution & Standard Scores (Z)","Joint Distributions & Marginal Densities","Central Limit Theorem Formulation"],
      fatWeightage: 22,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 4,
      name: "Sampling & Large Sample Hypothesis Testing",
      coreTopics: ["Sampling Distributions and Standard Error","Point and Interval Estimation (Confidence Intervals)","Large Sample Z-Tests for Means and Proportions","Type I and Type II Errors & Power of Test"],
      fatWeightage: 22,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 5,
      name: "Small Sample Tests & ANOVA",
      coreTopics: ["Student's t-Test for Independent & Paired Samples","F-Test for Equality of Variances","Chi-Square Test for Goodness of Fit & Independence","One-Way Analysis of Variance (ANOVA)"],
      fatWeightage: 16,
    },
  ],

  // MAT1014: Fundamental Statistics
  MAT1014: [
    {
      moduleNumber: 1,
      name: "Data Summarization & Representation",
      coreTopics: ["Frequency Distributions & Histograms","Mean, Median, Mode and Quantiles","Range, Variance and Standard Deviation","Box Plots and Outlier Detection"],
      fatWeightage: 18,
      cat1Weightage: 25,
    },
    {
      moduleNumber: 2,
      name: "Probability Concepts & Conditional Events",
      coreTopics: ["Sample Spaces, Events & Algebra of Sets","Addition and Multiplication Rules","Conditional Probability & Independent Events","Total Probability and Bayes Rule"],
      fatWeightage: 20,
      cat1Weightage: 25,
    },
    {
      moduleNumber: 3,
      name: "Theoretical Probability Models",
      coreTopics: ["Discrete Distributions: Bernoulli, Binomial, Poisson","Continuous Models: Normal and Exponential","Mean, Variance and Moment Generating Functions","Applications to Real-World Queuing and Reliability"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Correlation & Bivariate Modeling",
      coreTopics: ["Scatter Diagrams & Scatter Plots","Spearman's Rank Correlation Coefficient","Bivariate Normal Models","Regression Coefficients and Prediction Intervals"],
      fatWeightage: 22,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Introduction to Statistical Inference",
      coreTopics: ["Population vs Sample Statistics","Unbiased Estimators & Standard Error","Basic Confidence Intervals for Means","Elementary Hypothesis Testing Criteria"],
      fatWeightage: 16,
    },
  ],

  // MAT2001: Statistics for Engineers
  MAT2001: [
    {
      moduleNumber: 1,
      name: "Probability Fundamentals & Random Variables",
      coreTopics: ["Sample Spaces, Axioms & Conditional Probability","Bayes' Theorem & Diagnostic Odds","Discrete & Continuous Random Variables","Cumulative Distribution Functions (CDF)"],
      fatWeightage: 16,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Standard Probability Distributions",
      coreTopics: ["Binomial and Poisson Distribution Models","Uniform and Exponential Life Testing","Normal Distribution and Empirical Rule","Weibull and Gamma Reliability Distributions"],
      fatWeightage: 22,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Estimation Theory & Confidence Intervals",
      coreTopics: ["Point Estimation & Maximum Likelihood Estimator (MLE)","Confidence Intervals for Normal Means (known/unknown sigma)","Confidence Intervals for Proportions and Variances","Sample Size Determination for Desired Margin of Error"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Hypothesis Testing in Engineering",
      coreTopics: ["Null and Alternative Hypotheses & p-Values","One-Sample and Two-Sample Z and t Tests","Paired Comparison t-Tests in Manufacturing","Chi-Square Contingency Tables & Homogeneity"],
      fatWeightage: 22,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "ANOVA & Statistical Quality Control",
      coreTopics: ["One-Way and Two-Way ANOVA with Factorial Designs","Linear Regression Diagnostics & R-Squared","Control Charts for Variables (X-bar and R charts)","Control Charts for Attributes (p and c charts)"],
      fatWeightage: 16,
    },
  ],

  // MAT2002: Complex Variables and Linear Algebra
  MAT2002: [
    {
      moduleNumber: 1,
      name: "Analytic Functions & Cauchy-Riemann Equations",
      coreTopics: ["Complex Functions, Limits and Continuity","Cauchy-Riemann Equations in Cartesian & Polar Form","Harmonic Functions & Harmonic Conjugates","Conformal Mapping and Bilinear Transformations"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Complex Integration & Residue Theorem",
      coreTopics: ["Cauchy's Integral Theorem & Integral Formula","Taylor and Laurent Series Expansions","Singularities, Poles and Residue Calculation","Cauchy's Residue Theorem & Contour Integrals"],
      fatWeightage: 22,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Vector Spaces, Subspaces & Basis",
      coreTopics: ["Definition of Vector Space over R and C","Linear Dependence and Independence","Basis, Dimension and Coordinate Vectors","Null Space, Column Space and Row Space"],
      fatWeightage: 22,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 4,
      name: "Inner Product Spaces & Gram-Schmidt",
      coreTopics: ["Complex Inner Products and Norms","Orthogonality and Orthogonal Complements","Gram-Schmidt Orthonormalization Process","Orthogonal Projections and Least Squares"],
      fatWeightage: 22,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 5,
      name: "Eigenvalues & Canonical Forms",
      coreTopics: ["Eigenvalues and Eigenvectors of Complex Matrices","Hermitian, Unitary and Normal Matrices","Diagonalization of Matrices","Cayley-Hamilton Theorem & Matrix Exponentials"],
      fatWeightage: 16,
    },
  ],

  // MAT2005: Discrete Mathematical Structures (CSE)
  MAT2005: [
    {
      moduleNumber: 1,
      name: "Logic, Predicates & Quantifiers",
      coreTopics: ["Propositional Equivalences & Normal Forms (CNF/DNF)","Predicate Logic & Nested Quantifiers","Proof Methods (Contradiction, Induction, Invariants)","Applications to Program Correctness Verification"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Set Systems, Relations & Posets",
      coreTopics: ["Relations and Equivalence Relations","Partial Orders, Total Orders & Well-Ordering","Hasse Diagrams, Topological Sorting","Lattices and Distributive Lattices"],
      fatWeightage: 20,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Advanced Counting & Recurrences",
      coreTopics: ["Combinatorial Proofs & Binomial Identities","Inclusion-Exclusion & Derangements","Master Theorem for Recurrence Relations","Generating Functions & Integer Partitions"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Graph Theory & Network Flows",
      coreTopics: ["Graph Connectivity & Eulerian Circuits","Hamiltonian Cycles & Traveling Salesperson","Bipartite Matching & Hall Marriage Theorem","Planarity & Kuratowski Theorem"],
      fatWeightage: 22,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Algebraic Structures & Coding Theory",
      coreTopics: ["Groups, Rings, Integral Domains & Fields","Cosets and Normal Subgroups","Linear Block Codes & Hamming Distance","Error Detection and Correction Principles"],
      fatWeightage: 16,
    },
  ],

  // MAT3004: Applied Linear Algebra (Advanced)
  MAT3004: [
    {
      moduleNumber: 1,
      name: "Matrix Factorizations & Linear Systems",
      coreTopics: ["Gaussian Elimination with Partial Pivoting","LU and Cholesky Factorizations","Vector Norms and Matrix Condition Numbers","Iterative Methods (Jacobi, Gauss-Seidel)"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Orthogonality & Subspace Projections",
      coreTopics: ["Fundamental Subspaces Decomposition","Orthogonal Projection onto Subspaces","QR Factorization using Householder Reflectors","Constrained Least Squares Formulations"],
      fatWeightage: 22,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Eigendecomposition & Spectral Theorem",
      coreTopics: ["Eigenvalues of Symmetric & Positive Definite Matrices","Spectral Theorem for Real Symmetric Matrices","Rayleigh Quotient & Min-Max Characterizations","Quadratic Forms & Optimization"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Singular Value Decomposition (SVD)",
      coreTopics: ["Geometric Interpretation of SVD","Compact and Truncated SVD","Low-Rank Matrix Approximations (Eckart-Young Theorem)","Pseudoinverse & Minimum Norm Solutions"],
      fatWeightage: 22,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Modern Applications in Data Science & ML",
      coreTopics: ["Principal Component Analysis (PCA) Derivation","PageRank Algorithm as Markov Matrix Eigenvector","Non-Negative Matrix Factorization (NMF)","Tensors and Multilinear Algebra Basics"],
      fatWeightage: 16,
    },
  ],

  // MAT3005: Probability and Statistics
  MAT3005: [
    {
      moduleNumber: 1,
      name: "Random Variables & Joint Distributions",
      coreTopics: ["Joint Probability Mass and Density Functions","Marginal and Conditional Distributions","Covariance, Correlation & Independence","Bivariate Transformation of Variables"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Special Continuous Probability Models",
      coreTopics: ["Gamma, Beta, and Cauchy Distributions","Lognormal and Weibull Distributions","Central Limit Theorem & Law of Large Numbers","Moment Generating & Characteristic Functions"],
      fatWeightage: 22,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Point & Interval Estimation",
      coreTopics: ["Criteria of Good Estimator: Unbiasedness, Efficiency, Consistency","Method of Moments & Maximum Likelihood Estimation","Fisher Information and Cramer-Rao Lower Bound","Confidence Intervals for Normal Parameters"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Testing of Hypotheses & Likelihood Ratio",
      coreTopics: ["Neyman-Pearson Lemma for Most Powerful Tests","Likelihood Ratio Tests for Simple & Composite Hypotheses","Goodness-of-Fit Tests (Chi-Square & Kolmogorov-Smirnov)","Non-Parametric Tests (Wilcoxon Signed-Rank, Mann-Whitney)"],
      fatWeightage: 22,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Regression Models & Stochastic Processes",
      coreTopics: ["Simple and Multiple Linear Regression Analysis","Residual Analysis & Multicollinearity Diagnostics","Introduction to Discrete-Time Markov Chains","Stationary Distributions and Transition Matrices"],
      fatWeightage: 16,
    },
  ],

  // CHY1008: Basic Chemistry and Environmental Sciences
  CHY1008: [
    {
      moduleNumber: 1,
      name: "Water Quality & Treatment Technologies",
      coreTopics: ["Hardness of Water (Temporary & Permanent) and Units","EDTA Complexometric Titration Method","Softening: Ion-Exchange and Reverse Osmosis (RO)","Municipal Water Purification & COD/BOD Indicators"],
      fatWeightage: 18,
      cat1Weightage: 25,
    },
    {
      moduleNumber: 2,
      name: "Electrochemistry & Energy Storage Systems",
      coreTopics: ["Nernst Equation & Electrochemical Cells","Standard Hydrogen Electrode & Reference Electrodes","Lithium-Ion Batteries & Lead-Acid Accumulators","Fuel Cells (Proton Exchange Membrane - PEMFC)"],
      fatWeightage: 22,
      cat1Weightage: 25,
    },
    {
      moduleNumber: 3,
      name: "Corrosion Science & Protection Mechanisms",
      coreTopics: ["Electrochemical Mechanism of Corrosion (Dry & Wet)","Galvanic, Pitting and Stress Corrosion","Corrosion Prevention: Cathodic Protection (Sacrificial Anode)","Electroplating and Electroless Plating Techniques"],
      fatWeightage: 22,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 4,
      name: "Polymers, Composites & Advanced Materials",
      coreTopics: ["Thermoplastics vs Thermosetting Polymers","Conducting Polymers (Polyaniline, Polyacetylene)","FRP (Fiber-Reinforced Plastics) & Carbon Nanotubes","Biodegradable Polymers & Industrial Applications"],
      fatWeightage: 22,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 5,
      name: "Environmental Pollution & Sustainable Remediation",
      coreTopics: ["Air Pollutants (PM2.5, NOx, SOx) and Acid Rain","Greenhouse Effect, Global Warming & Carbon Footprint","Hazardous Waste Management & E-Waste Recycling","Green Chemistry Principles & Renewable Energy"],
      fatWeightage: 16,
    },
  ],

  // CHY1009: Chemistry and Environmental Studies
  CHY1009: [
    {
      moduleNumber: 1,
      name: "Water Chemistry & Treatment Systems",
      coreTopics: ["Hardness Calculation & EDTA Method","Boiler Troubles (Scale, Sludge, Priming & Foaming)","Demineralization by Ion-Exchange Resins","Desalination via Electrodialysis & RO Membranes"],
      fatWeightage: 18,
      cat1Weightage: 25,
    },
    {
      moduleNumber: 2,
      name: "Energy Storage & Conversion Technologies",
      coreTopics: ["Electrochemical Series & Cell EMF Calculation","Secondary Batteries: Li-Ion & Ni-Cd Systems","Solar Photovoltaic Cells and Bandgap Principles","Hydrogen Fuel Cells and Thermodynamic Efficiency"],
      fatWeightage: 22,
      cat1Weightage: 25,
    },
    {
      moduleNumber: 3,
      name: "Corrosion Engineering & Protective Coatings",
      coreTopics: ["Chemical vs Electrochemical Corrosion Theories","Galvanic and Differential Aeration Corrosion","Passivity and Pourbaix Potential-pH Diagrams","Cathodic Protection & Metallic Coatings (Galvanizing/Tinning)"],
      fatWeightage: 22,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 4,
      name: "Nanomaterials & Smart Engineering Polymers",
      coreTopics: ["Synthesis of Nanomaterials (Sol-Gel, Chemical Vapor Deposition)","Carbon Allotropes (Fullerenes, Graphene, CNTs)","Engineering Plastics (Polycarbonates, Teflon, Kevlar)","Smart Shape-Memory Polymers and Biomedical Uses"],
      fatWeightage: 22,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 5,
      name: "Environmental Ecology & Sustainable Engineering",
      coreTopics: ["Ecosystem Dynamics & Biogeochemical Cycles","Water Pollution Indicators (DO, BOD, COD)","Solid Waste Management & Circular Economy Principles","Renewable Energy Integration & Environmental Impact Assessment (EIA)"],
      fatWeightage: 16,
    },
  ],

  // PHY1005: Fundamentals of Engineering Physics
  PHY1005: [
    {
      moduleNumber: 1,
      name: "Wave Optics & Interference",
      coreTopics: ["Principle of Superposition & Coherent Sources","Interference in Thin Films & Newton's Rings Experiment","Air Wedge Method & Surface Flatness Testing","Michelson Interferometer and Wavelength Measurement"],
      fatWeightage: 18,
      cat1Weightage: 25,
    },
    {
      moduleNumber: 2,
      name: "Diffraction & Polarization",
      coreTopics: ["Fraunhofer Diffraction at Single Slit & Circular Aperture","Plane Diffraction Grating and Resolving Power","Polarization by Reflection (Brewster Law) & Double Refraction","Quarter-Wave & Half-Wave Plates; Optical Activity"],
      fatWeightage: 20,
      cat1Weightage: 25,
    },
    {
      moduleNumber: 3,
      name: "Quantum Mechanics & Wave Packets",
      coreTopics: ["De Broglie Hypothesis & Matter Waves","Heisenberg Uncertainty Principle","Time-Dependent & Time-Independent Schrodinger Equations","Particle in a 1D Infinite Potential Well (Eigenvalues & Eigenfunctions)"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Lasers & Fiber Optics",
      coreTopics: ["Spontaneous and Stimulated Emission (Einstein Coefficients)","Ruby Laser and He-Ne Laser Operating Mechanisms","Optical Fibers: Numerical Aperture and Acceptance Angle","Step-Index & Graded-Index Fibers; Attenuation Mechanisms"],
      fatWeightage: 22,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Dielectrics & Magnetic Materials",
      coreTopics: ["Dielectric Polarization Mechanisms (Electronic, Ionic, Dipolar)","Clausius-Mossotti Equation & Dielectric Breakdown","Classification of Magnetic Materials (Dia, Para, Ferro, Anti-Ferro)","Hysteresis Loop (B-H Curve) & Soft/Hard Magnetic Materials"],
      fatWeightage: 16,
    },
  ],

  // PHY1008: Modern Physics
  PHY1008: [
    {
      moduleNumber: 1,
      name: "Special Relativity & Spacetime Mechanics",
      coreTopics: ["Michelson-Morley Experiment & Postulates of Relativity","Lorentz Transformations for Space and Time","Length Contraction and Time Dilation","Relativistic Mass, Momentum, and Mass-Energy Equivalence"],
      fatWeightage: 18,
      cat1Weightage: 25,
    },
    {
      moduleNumber: 2,
      name: "Quantum Foundations & Wave-Particle Duality",
      coreTopics: ["Planck's Radiation Law and Photoelectric Effect","Compton Scattering Derivation and Shift","Phase Velocity and Group Velocity of Wave Packets","Born Interpretation of Wavefunction & Normalization"],
      fatWeightage: 22,
      cat1Weightage: 25,
    },
    {
      moduleNumber: 3,
      name: "Quantum Mechanics of Bound Systems",
      coreTopics: ["Schrodinger Equation for 1D Infinite Well","Quantum Tunneling through a Finite Potential Barrier","Quantum Harmonic Oscillator Energy Levels","Hydrogen Atom Potential and Quantum Numbers (n, l, m, s)"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Solid State Physics & Band Theory",
      coreTopics: ["Free Electron Theory of Metals & Fermi-Dirac Distribution","Kronig-Penney Model & Origin of Energy Bands","Intrinsic and Extrinsic Semiconductors & Fermi Levels","Direct and Indirect Bandgap Materials"],
      fatWeightage: 20,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Superconductivity & Nanophysics",
      coreTopics: ["Meissner Effect and Critical Magnetic Field","Type-I and Type-II Superconductors","BCS Theory of Superconductivity (Cooper Pairs)","Quantum Confinement & Density of States in Quantum Dots/Wires"],
      fatWeightage: 16,
    },
  ],

  // ENG1001: English for Essential Communication
  ENG1001: [
    {
      moduleNumber: 1,
      name: "Foundations of Grammar & Functional Syntax",
      coreTopics: ["Parts of Speech & Grammatical Accuracy","Subject-Verb Agreement in Complex Sentences","Tenses and Aspect in Contextual Usage","Active and Passive Voice Transformations"],
      fatWeightage: 18,
      cat1Weightage: 25,
    },
    {
      moduleNumber: 2,
      name: "Vocabulary Enhancement & Word Formations",
      coreTopics: ["Prefixes, Suffixes and Root Words","Synonyms, Antonyms, and Homophones","Collocations and Idiomatic Expressions","Contextual Reading & Vocabulary in Action"],
      fatWeightage: 20,
      cat1Weightage: 25,
    },
    {
      moduleNumber: 3,
      name: "Reading Comprehension & Critical Analysis",
      coreTopics: ["Skimming and Scanning Strategies","Identifying Main Ideas, Inferences & Tone","Paraphrasing and Summarizing Technical Passages","Speed Reading Techniques"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Basic Technical Writing & Drafting",
      coreTopics: ["Paragraph Organization (Coherence & Cohesion)","Sentence Variety and Transition Signals","Formal Email Etiquette and Structure","Short Note Taking and Minutes of Meeting"],
      fatWeightage: 22,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Oral Communication & Phonetics Basics",
      coreTopics: ["Basic Phonetic Symbols & Pronunciation","Word Stress and Sentence Intonation","Self-Introduction & Elevator Pitching","Active Listening Strategies"],
      fatWeightage: 16,
    },
  ],

  // ENG1002: English for Effective Communication
  ENG1002: [
    {
      moduleNumber: 1,
      name: "Advanced Grammar & Sentence Mechanics",
      coreTopics: ["Direct and Indirect Speech Transitions","Conditional Sentences (Type 0, 1, 2, 3)","Sentence Modification and Reducing Clauses","Elimination of Redundancy and Ambiguity"],
      fatWeightage: 18,
      cat1Weightage: 25,
    },
    {
      moduleNumber: 2,
      name: "Technical Reading & Synthesis",
      coreTopics: ["Analytical Reading of Research Papers","Fact vs Opinion Distinctions","Synthesizing Multiple Document Sources","Critical Evaluation of Author Perspectives"],
      fatWeightage: 20,
      cat1Weightage: 25,
    },
    {
      moduleNumber: 3,
      name: "Professional Writing & Documentation",
      coreTopics: ["Technical Descriptions of Gadgets/Processes","Instruction Manuals & Standard Operating Procedures","Formal Letter Writing (Inquiry, Complaint, Permission)","Memo and Circular Drafting"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Report Writing & Proposals",
      coreTopics: ["Structure of Technical Reports (Abstract, Methodology, Findings)","Data Interpretation from Charts and Graphs","Writing Feasibility and Project Proposals","Referencing and Plagiarism Avoidance (IEEE/APA)"],
      fatWeightage: 22,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Public Speaking & Presentation Skills",
      coreTopics: ["Designing Effective Visual Slides","Audience Awareness and Non-Verbal Gestures","Handling Q&A Sessions with Confidence","Impromptu Speaking (Extempore)"],
      fatWeightage: 16,
    },
  ],

  // ENG1005: Basic Communication in English
  ENG1005: [
    {
      moduleNumber: 1,
      name: "Basic Grammar & Everyday Expressions",
      coreTopics: ["Nouns, Pronouns, and Basic Modifiers","Common Prepositions of Time and Place","Question Formations (Wh- questions & Auxiliary)","Conversational Greetings and Polite Requests"],
      fatWeightage: 20,
      cat1Weightage: 25,
    },
    {
      moduleNumber: 2,
      name: "Pronunciation & Listening Essentials",
      coreTopics: ["Vowel and Consonant Sound Distinction","Word Stress in Multisyllabic Words","Listening for Specific Information","Dialogues in Daily Situations"],
      fatWeightage: 20,
      cat1Weightage: 25,
    },
    {
      moduleNumber: 3,
      name: "Guided Reading & Text Comprehension",
      coreTopics: ["Reading Short Stories and News Clips","Vocabulary Discovery from Context","Sequencing Events in Narrative Order","Formulating Short Answers to Questions"],
      fatWeightage: 22,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 4,
      name: "Guided Writing & Paragraph Creation",
      coreTopics: ["Topic Sentences and Supporting Details","Describing People, Places and Daily Routines","Simple Leave Letters and Informative Notes","Punctuation and Capitalization Rules"],
      fatWeightage: 22,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 5,
      name: "Interactive Speaking Practice",
      coreTopics: ["Role Plays in Retail, Travel and Campus Settings","Giving and Following Step-by-Step Directions","Sharing Opinions and Agreeing/Disagreeing Politely","Group Discussions on Simple Social Topics"],
      fatWeightage: 16,
    },
  ],

  // ENG1006: Functional Communication in English
  ENG1006: [
    {
      moduleNumber: 1,
      name: "Workplace Grammar & Functional Language",
      coreTopics: ["Modal Verbs for Ability, Permission & Obligation","Conjunctions and Complex Sentence Building","Colloquial vs Formal Register in Writing","Error Correction in Business Correspondence"],
      fatWeightage: 18,
      cat1Weightage: 25,
    },
    {
      moduleNumber: 2,
      name: "Business Reading & Information Retrieval",
      coreTopics: ["Interpreting Corporate Announcements and Circulars","Reading Case Studies and Identifying Bottlenecks","Extracting Quantitative Metrics from Text","Summarizing Business Articles"],
      fatWeightage: 20,
      cat1Weightage: 25,
    },
    {
      moduleNumber: 3,
      name: "Professional Email & Communication Channels",
      coreTopics: ["Structure of Action-Oriented Business Emails","Netiquette in Slack/Teams and Virtual Workspaces","Follow-up Communications and Escalation Memos","Drafting Meeting Agendas and Action Items"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Resumes, Cover Letters & Profile Writing",
      coreTopics: ["Modern Chronological and Functional Resume Formats","Drafting Tailored Cover Letters for Job Roles","Writing Professional LinkedIn Summaries","Showcasing Project Portfolios and Soft Skills"],
      fatWeightage: 22,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Interview Readiness & Group Discussions",
      coreTopics: ["Behavioral Interview Techniques (STAR Method)","Handling Common HR and Technical Questions","Body Language, Eye Contact and Professional Posture","Group Discussion Dynamics and Consensus Building"],
      fatWeightage: 16,
    },
  ],

  // ENG2001: English for Professional Communication
  ENG2001: [
    {
      moduleNumber: 1,
      name: "Corporate Communication Dynamics",
      coreTopics: ["Communication Flow: Upward, Downward, Lateral, Diagonal","Barriers to Communication (Psychological, Cultural, Linguistic)","Intercultural Communication in Global Teams","Ethics in Professional Communication"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Technical Proposals & Bidding Documents",
      coreTopics: ["Elements of Technical Project Proposals (RFP/RFQ)","Executive Summary Writing for Decision Makers","Cost Estimation and Project Timeline Presentation","Persuasive Writing Techniques in B2B Contexts"],
      fatWeightage: 22,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Research Paper Writing & Ethics",
      coreTopics: ["Structure of Research Papers: IMRAD Format","Literature Review Synthesis and Gap Analysis","Citation Standards (IEEE, ACM, Harvard)","Ethics in Publishing, Peer Review & Anti-Plagiarism"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Negotiation & Conflict Resolution Skills",
      coreTopics: ["Principles of Principled Negotiation (Fisher & Ury)","Conflict Management Styles (Thomas-Kilmann Model)","De-escalation Language and Assertive Communication","Facilitating Client Consultations and Meetings"],
      fatWeightage: 20,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Executive Presentations & Pitching",
      coreTopics: ["Structuring Pitch Decks for Investors & Stakeholders","Storytelling Techniques with Data Visualizations","Handling Hostile Questions & Skeptical Audiences","Virtual Presentation Best Practices"],
      fatWeightage: 16,
    },
  ],

  // ENG2004: Advanced Communication in English
  ENG2004: [
    {
      moduleNumber: 1,
      name: "Rhetorical Devices & Persuasive Discourse",
      coreTopics: ["Ethos, Pathos, and Logos in Engineering Advocacy","Rhetorical Tropes and Schemes (Metaphor, Analogy, Antithesis)","Constructing Sound Arguments & Identifying Logical Fallacies","Critical Discourse Analysis of Media & Tech Speeches"],
      fatWeightage: 18,
      cat1Weightage: 25,
    },
    {
      moduleNumber: 2,
      name: "Advanced Stylistics & Professional Editing",
      coreTopics: ["Sentence Rhythm, Parallelism and Voice Modulation","Micro-Editing for Conciseness, Precision, and Impact","Style Guides (Chicago, Oxford, AP) Compliance","Proofreading Strategies for High-Stakes Publications"],
      fatWeightage: 20,
      cat1Weightage: 25,
    },
    {
      moduleNumber: 3,
      name: "Strategic Whitepapers & Policy Briefs",
      coreTopics: ["Drafting Technology Whitepapers for Public and Industry","Writing Policy Briefs on Emerging Technologies (AI, Privacy)","Stakeholder Impact Assessment Documentation","Formulating Executive Recommendations"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Crisis Communication & Media Relations",
      coreTopics: ["Managing Communication during System Outages/Breaches","Press Release Drafting and Spokesperson Guidelines","Brand Reputation Protection on Social Media","Crafting Transparent Incident Post-Mortems"],
      fatWeightage: 22,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "High-Impact Debating & Keynote Delivery",
      coreTopics: ["Parliamentary and Oxford Debate Formats","Rebuttal Construction and Cross-Examination","Keynote Speech Architecture for Tech Conferences","Voice Modulation, Pace, and Gravitas in Leadership"],
      fatWeightage: 16,
    },
  ],

  // ECE1002: Fundamentals of Electrical and Electronics Engineering
  ECE1002: [
    {
      moduleNumber: 1,
      name: "DC Circuit Analysis & Theorems",
      coreTopics: ["Ohm's Law & Kirchhoff's Current/Voltage Laws (KCL, KVL)","Nodal and Mesh Analysis for Resistive Networks","Thevenin and Norton Equivalent Circuit Theorems","Superposition and Maximum Power Transfer Theorems"],
      fatWeightage: 18,
      cat1Weightage: 25,
    },
    {
      moduleNumber: 2,
      name: "AC Circuits & Resonance",
      coreTopics: ["Sinusoidal Steady State & Phasor Representation","Series and Parallel RLC Circuits","Power Factor: Real, Reactive and Apparent Power","Resonance in Series & Parallel Tuned Circuits"],
      fatWeightage: 20,
      cat1Weightage: 25,
    },
    {
      moduleNumber: 3,
      name: "Magnetic Circuits & Transformers",
      coreTopics: ["Magnetic Field Concepts, MMF, Flux, and Reluctance","Single-Phase Transformer: Ideal vs Practical Models","Equivalent Circuit & Voltage Regulation Calculation","Efficiency and Open-Circuit / Short-Circuit Tests"],
      fatWeightage: 22,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 4,
      name: "Semiconductor Diodes & Applications",
      coreTopics: ["PN Junction Diode Characteristics & Barrier Potential","Zener Diode as a Precision Voltage Regulator","Half-Wave and Full-Wave Rectifiers with Capacitor Filter","Light Emitting Diodes (LED) and Photodiodes"],
      fatWeightage: 22,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 5,
      name: "Transistors & Operational Amplifiers",
      coreTopics: ["Bipolar Junction Transistor (BJT) Characteristics (CE Mode)","BJT as a Switch and Simple Amplifier","Ideal Op-Amp Characteristics & Virtual Ground Concept","Op-Amp Inverting, Non-Inverting, and Summer Configurations"],
      fatWeightage: 18,
    },
  ],

  // ECE1003: Digital Logic Design
  ECE1003: [
    {
      moduleNumber: 1,
      name: "Number Systems & Boolean Algebra",
      coreTopics: ["Binary, Octal, Hexadecimal & Signed Number Representations","2's Complement Arithmetic & Overflow Detection","Boolean Theorems & De Morgan Laws","Canonical SOP and POS Forms"],
      fatWeightage: 16,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Combinational Logic Optimization",
      coreTopics: ["Karnaugh Maps (K-Maps) up to 5 Variables & Don’t Care Conditions","Quine-McCluskey (Tabular) Minimization Method","NAND and NOR Universal Gate Implementations","Hazard and Race Conditions in Combinational Circuits"],
      fatWeightage: 22,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Combinational Building Blocks",
      coreTopics: ["Half Adder, Full Adder & Carry-Lookahead Adders","Multiplexers and Demultiplexers Architecture","Priority Encoders and BCD to 7-Segment Decoders","Magnitude Comparators and Parity Generators/Checkers"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Sequential Logic & Latches/Flip-Flops",
      coreTopics: ["SR, JK, D, and T Flip-Flops and Master-Slave Design","Flip-Flop Conversion and Characteristic Equations","Setup Time, Hold Time and Clock Skew","Finite State Machine (FSM) Models: Mealy vs Moore"],
      fatWeightage: 22,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Registers, Counters & Programmable Logic",
      coreTopics: ["Synchronous & Asynchronous (Ripple) Up/Down Counters","Shift Registers (SISO, SIPO, PISO, PIPO) & Ring/Johnson Counters","Programmable Logic Devices (PLA, PAL, CPLD)","Verilog HDL Fundamentals for Combinational Circuits"],
      fatWeightage: 16,
    },
  ],

  // ECE1005: Basic Electric and Electronics Studies
  ECE1005: [
    {
      moduleNumber: 1,
      name: "Fundamental Circuit Laws & DC Analysis",
      coreTopics: ["Voltage and Current Division Rules","Kirchhoff Circuit Analysis in Multi-Loop Networks","Source Transformation & Star-Delta Conversion","Superposition Principle in Linear Systems"],
      fatWeightage: 18,
      cat1Weightage: 25,
    },
    {
      moduleNumber: 2,
      name: "AC Waveforms & Single-Phase Circuits",
      coreTopics: ["RMS, Average, Peak Factor and Form Factor of AC","Impedance and Admittance in RL, RC, and RLC Circuits","Active, Reactive, and Complex Power Calculations","Power Factor Correction Methods in Industrial Loads"],
      fatWeightage: 20,
      cat1Weightage: 25,
    },
    {
      moduleNumber: 3,
      name: "Electrical Machines & Safety Principles",
      coreTopics: ["Operating Principle of DC Motors and Back EMF","Three-Phase Induction Motor: Rotating Magnetic Field","Earthing, Circuit Breakers (MCB, ELCB) and Electrical Safety","Energy Metering and Tariff Systems"],
      fatWeightage: 22,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 4,
      name: "Analog Electronic Devices",
      coreTopics: ["V-I Characteristics of PN Diodes & Breakdown Voltage","DC Load Line & Operating Point (Q-point) of BJT","BJT Biasing Circuits (Fixed Bias & Voltage Divider Bias)","Field Effect Transistor (JFET, MOSFET) Operating Modes"],
      fatWeightage: 22,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 5,
      name: "Linear ICs & Electronic Sensors",
      coreTopics: ["Op-Amp Characteristics & Open Loop vs Closed Loop","Inverting, Non-Inverting, and Differential Amplifiers","Temperature Sensors (Thermistor, RTD, Thermocouple)","Strain Gauges and LVDT in Instrumentation"],
      fatWeightage: 18,
    },
  ],

  // ECE1006: Digital Logic and Microprocessors
  ECE1006: [
    {
      moduleNumber: 1,
      name: "Boolean Minimization & Combinational Circuits",
      coreTopics: ["K-Map Minimization with Don’t Cares","Design of Multi-Bit Adders and Subtractors","Multiplexers and Decoders in Logic Function Realization","Code Converters (Gray to Binary, BCD to Excess-3)"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Sequential Machine Design",
      coreTopics: ["State Diagram, State Table and State Reduction","Design of Synchronous Decade and Mod-N Counters","Sequence Detectors (Overlapping and Non-Overlapping)","Timing Diagrams and Metastability Analysis"],
      fatWeightage: 22,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "8085 Microprocessor Architecture",
      coreTopics: ["8085 Pin Diagram, Internal Bus Architecture and Registers","ALU, Timing and Control Unit, and Flags","Instruction Cycle, Machine Cycle and T-States","Timing Diagrams for Memory Read and Write Operations"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "8085 Instruction Set & Assembly Programming",
      coreTopics: ["Data Transfer, Arithmetic and Logical Instructions","Branching, Call/Return and Stack Operations","Subroutines and Delay Loops Calculations","Assembly Programs for Sorting, Searching and Code Conversion"],
      fatWeightage: 20,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Interrupts & Peripheral Interfacing",
      coreTopics: ["8085 Hardware and Software Interrupts (TRAP, RST 7.5, INTR)","Interrupt Service Routine (ISR) Flow","Programmable Peripheral Interface (8255 PPI) Architecture","Interfacing 7-Segment Displays and Stepper Motors"],
      fatWeightage: 16,
    },
  ],

  // ECE2001: Network Theory
  ECE2001: [
    {
      moduleNumber: 1,
      name: "Mesh/Node Analysis & Graph Theory",
      coreTopics: ["Graph Matrices: Incidence, Tie-Set, and Cut-Set Matrices","Duality in Electric Circuits and Dual Networks","Modified Nodal Analysis for Operational Networks","Tellegen, Reciprocity and Substitution Theorems"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Transient Analysis of First & Second Order Circuits",
      coreTopics: ["Source-Free and Driven RL and RC Circuits","Step and Impulse Responses of RLC Circuits","Underdamped, Critically Damped, and Overdamped Behaviors","Initial and Final Value Conditions at t=0+ and t=infinity"],
      fatWeightage: 22,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Laplace Transform in Circuit Analysis",
      coreTopics: ["Transformed Impedance and Admittance Networks","Circuit Analysis of Switched Circuits using s-Domain Models","Poles and Zeros of Network Functions and Stability","Convolution Integral for Arbitrary System Inputs"],
      fatWeightage: 22,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 4,
      name: "Two-Port Network Parameters",
      coreTopics: ["Z, Y, ABCD (Transmission), and h (Hybrid) Parameters","Relationships and Conversions between Parameter Sets","Interconnection of Two-Port Networks (Series, Parallel, Cascade)","T and Pi Equivalent Network Representations"],
      fatWeightage: 22,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 5,
      name: "Network Synthesis & Passive Filter Design",
      coreTopics: ["Positive Real (PR) Functions and Hurwitz Polynomials","Foster Form I and Form II Realization of LC/RC Networks","Cauer Form I and Form II Continued Fraction Realization","Constant-k and m-Derived Passive Low-Pass and High-Pass Filters"],
      fatWeightage: 16,
    },
  ],

  // ECE2002: Computer Organization and Architecture (ECE)
  ECE2002: [
    {
      moduleNumber: 1,
      name: "Processor Data Path & Instruction Cycles",
      coreTopics: ["Register Transfer Language (RTL) & Bus Structure","Instruction Formats (Zero, One, Two, Three Address)","Addressing Modes (Direct, Indirect, Indexed, PC-Relative)","Micro-Operations and Hardwired vs Microprogrammed Control Unit"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Computer Arithmetic & ALU Design",
      coreTopics: ["Booth's Multiplication Algorithm for Signed Numbers","Restoring and Non-Restoring Division Algorithms","IEEE 754 Floating-Point Representation (Single & Double Precision)","ALU Hardware Design & Fast Adders"],
      fatWeightage: 22,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Instruction Pipelining & Hazards",
      coreTopics: ["Linear Pipeline Processors and Performance Speedup","Structural, Data, and Control Hazards in Pipelines","Hazard Mitigation: Forwarding, Branch Prediction & Stalling","Instruction Level Parallelism (ILP) and Superscalar Processors"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Memory Hierarchy & Cache Organization",
      coreTopics: ["Memory Hierarchy Levels and Latency Gap","Cache Mapping Techniques (Direct, Associative, Set-Associative)","Cache Miss Types (Compulsory, Capacity, Conflict) & Replacement Policies","Virtual Memory, TLB Organization and Page Tables"],
      fatWeightage: 20,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "I/O Organization & Interconnects",
      coreTopics: ["Programmed I/O vs Interrupt-Driven I/O","Direct Memory Access (DMA) Controller Architecture","Bus Arbitration (Daisy Chaining, Polling, Independent Requests)","Standard Interfaces (PCIe, USB, SATA) and Multiprocessor Topologies"],
      fatWeightage: 16,
    },
  ],

  // ECE2003: Signals and Systems
  ECE2003: [
    {
      moduleNumber: 1,
      name: "Classification of Signals & Systems",
      coreTopics: ["Continuous-Time vs Discrete-Time Signals","Elementary Signals (Unit Step, Impulse, Ramp, Sinc, Complex Exponential)","System Properties: Linearity, Time-Invariance, Causality, Stability (BIBO)","Invertibility and Memory in Systems"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Linear Time-Invariant (LTI) Systems & Convolution",
      coreTopics: ["Impulse Response and Convolution Integral (CT)","Convolution Sum for Discrete-Time LTI Systems","Interconnection of LTI Systems (Series and Parallel)","Step Response and Stability Conditions in Time Domain"],
      fatWeightage: 22,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Fourier Analysis of Continuous-Time Signals",
      coreTopics: ["Continuous-Time Fourier Series (Trigonometric & Exponential)","Continuous-Time Fourier Transform (CTFT) Properties","Frequency Response of CT-LTI Systems & Ideal Filters","Energy and Power Spectral Density; Parseval Relation"],
      fatWeightage: 22,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 4,
      name: "Sampling Theorem & Discrete Fourier Analysis",
      coreTopics: ["Nyquist-Shannon Sampling Theorem & Aliasing Prevention","Reconstruction of Signals from Samples (Ideal Interpolation)","Discrete-Time Fourier Transform (DTFT) and Properties","Frequency Response of DT-LTI Systems"],
      fatWeightage: 22,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 5,
      name: "Z-Transform & System Transfer Function",
      coreTopics: ["Z-Transform Definition, Region of Convergence (ROC) Properties","Inverse Z-Transform via Partial Fractions and Contour Integral","Analysis and Characterization of LTI Systems using Z-Transform","Pole-Zero Plots, Causality and Stability Criteria"],
      fatWeightage: 16,
    },
  ],

  // ECE2015: Computer Architecture
  ECE2015: [
    {
      moduleNumber: 1,
      name: "Instruction Set Architecture (ISA) & Performance",
      coreTopics: ["RISC vs CISC Architectural Philosophies","MIPS / RISC-V 32-Bit Instruction Formats","CPU Execution Time & Amdahl Law Speedup","MIPS Pipeline Architecture (IF, ID, EX, MEM, WB)"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Dynamic Scheduling & Speculative Execution",
      coreTopics: ["Scoreboarding Algorithm for Out-of-Order Execution","Tomasulo's Algorithm with Reservation Stations","Branch Prediction: Static, 2-Bit Dynamic, and Correlating Predictors","Reorder Buffer (ROB) and Precise Interrupt Handling"],
      fatWeightage: 24,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Memory Subsystems & Advanced Cache Techniques",
      coreTopics: ["Multi-Level Caches (L1, L2, L3) and Optimization Rules","Non-Blocking Caches and Hardware Prefetching","Cache Coherence Protocols: Snooping (MESI/MOESI) and Directory-Based","False Sharing and Memory Consistency Models (Sequential vs Relaxed)"],
      fatWeightage: 22,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Hardware Multithreading & Multi-Core Systems",
      coreTopics: ["Fine-Grained vs Coarse-Grained Multithreading","Simultaneous Multithreading (SMT / Hyper-Threading)","Symmetric Multiprocessors (SMP) & Distributed Shared Memory (DSM)","Interconnection Networks: Crossbar, Mesh, Torus, and Hypercube"],
      fatWeightage: 20,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Domain-Specific Architectures & Accelerators",
      coreTopics: ["Vector Processors & SIMD Matrix Instructions","GPU Architecture (Compute Units, Warps, Streaming Multiprocessors)","Tensor Processing Units (TPUs) & Systolic Arrays","Power-Aware Computing & Dark Silicon Challenges"],
      fatWeightage: 16,
    },
  ],

  // ECE3001: Analog Communication Systems
  ECE3001: [
    {
      moduleNumber: 1,
      name: "Amplitude Modulation (AM) Schemes",
      coreTopics: ["Standard AM: Generation, Waveform, Modulation Index & Power Distribution","Double Sideband Suppressed Carrier (DSB-SC): Balanced Modulator & Ring Modulator","Single Sideband (SSB-SC) and Vestigial Sideband (VSB) Modulation","Coherent vs Envelope Detection Techniques and Carrier Acquisition"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Angle Modulation: FM and PM",
      coreTopics: ["Narrowband and Wideband Frequency Modulation","Carson's Rule for Transmission Bandwidth","Direct and Indirect (Armstrong) Methods of FM Generation","FM Demodulation: Balanced Frequency Discriminator and Phase Locked Loop (PLL)"],
      fatWeightage: 22,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Noise Analysis in Continuous Wave Modulation",
      coreTopics: ["Thermal Noise, Shot Noise and White Gaussian Noise","Noise Figure, Equivalent Noise Temperature and SNR Calculations","Noise Performance in AM and DSB-SC Systems","Noise in FM Receivers: Threshold Effect, Pre-Emphasis and De-Emphasis Networks"],
      fatWeightage: 22,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 4,
      name: "Radio Receivers & Pulse Modulation",
      coreTopics: ["Superheterodyne Receiver Architecture (RF, Mixer, IF, Detector)","Intermediate Frequency (IF) Selection and Image Frequency Rejection","Automatic Gain Control (AGC) Schemes","Pulse Amplitude Modulation (PAM) & Pulse Width / Position Modulation (PWM/PPM)"],
      fatWeightage: 22,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 5,
      name: "Multiplexing & Broadcast Systems",
      coreTopics: ["Frequency Division Multiplexing (FDM) in Carrier Telephony","AM and FM Commercial Broadcast Standards","Phase Locked Loop (PLL) as FM Demodulator & Frequency Synthesizer","Phase Jitter and Non-Linear Distortion in RF Channels"],
      fatWeightage: 16,
    },
  ],

  // ECE3002: Digital Communication Systems
  ECE3002: [
    {
      moduleNumber: 1,
      name: "Pulse Code Modulation (PCM) & Baseband Quantization",
      coreTopics: ["Sampling, Uniform and Non-Uniform Quantization (Mu-Law & A-Law)","Pulse Code Modulation (PCM) Encoder and Decoder","Signal-to-Quantization Noise Ratio (SQNR) Analysis","Differential PCM (DPCM), Delta Modulation (DM) and Adaptive DM (ADM)"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Baseband Transmission & Intersymbol Interference (ISI)",
      coreTopics: ["Line Coding Schemes (NRZ, RZ, Manchester, AMI) and Spectral Characteristics","Intersymbol Interference (ISI) & Eye Pattern Analysis","Nyquist Criterion for Zero ISI and Raised-Cosine Filtering","Matched Filter Receiver Derivation and Error Probability"],
      fatWeightage: 22,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Digital Bandpass Modulation Techniques",
      coreTopics: ["Binary Amplitude Shift Keying (BASK) & Frequency Shift Keying (BFSK)","Binary Phase Shift Keying (BPSK) & Differential PSK (DPSK)","Quadrature Phase Shift Keying (QPSK) & Offset-QPSK (OQPSK)","Quadrature Amplitude Modulation (16-QAM and 64-QAM Constellations)"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Probability of Error & Coherent Detection",
      coreTopics: ["Geometric Representation of Signals (Gram-Schmidt Orthogonalization)","Maximum Likelihood (ML) Detection Rule and Decision Boundaries","Bit Error Rate (BER) Derivation for BPSK, QPSK, and BFSK over AWGN","Comparison of Power and Bandwidth Efficiency across Digital Modulation Schemes"],
      fatWeightage: 20,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Information Theory & Channel Coding",
      coreTopics: ["Measure of Information, Entropy and Mutual Information","Shannon's Source Coding Theorem & Huffman Coding","Shannon-Hartley Channel Capacity Theorem","Linear Block Codes: Generator and Parity-Check Matrices, Syndrome Decoding"],
      fatWeightage: 16,
    },
  ],

  // CSE1005: Software Engineering
  CSE1005: [
    {
      moduleNumber: 1,
      name: "Software Process Models & Lifecycle",
      coreTopics: ["SDLC Stages & Waterfall vs Agile Approaches","Spiral, Prototyping and Incremental Models","Scrum Framework: Sprints, Epics, User Stories & Ceremonies","Extreme Programming (XP) Practices"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Software Requirements Engineering",
      coreTopics: ["Functional vs Non-Functional Requirements (NFR)","Requirement Elicitation (Interviews, JAD, Prototyping)","IEEE 830 SRS Document Structure & Standards","Use Case Modeling and Requirements Traceability Matrix (RTM)"],
      fatWeightage: 22,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Software Design & Architectural Modeling",
      coreTopics: ["High-Level Architecture (MVC, Microservices, Layered)","Object-Oriented Design Principles (SOLID Principles)","UML Structural Diagrams (Class, Component, Deployment)","UML Behavioral Diagrams (Sequence, Activity, State Machine)"],
      fatWeightage: 22,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 4,
      name: "Software Testing Strategies & Verification",
      coreTopics: ["Black-Box Testing (BVA, Equivalence Partitioning, Cause-Effect)","White-Box Testing (Basis Path, Cyclomatic Complexity, Branch Coverage)","Unit, Integration, System, and Acceptance Testing","Regression Testing & Automated Test Suites (JUnit, Selenium)"],
      fatWeightage: 22,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 5,
      name: "Project Estimation, Quality & Maintenance",
      coreTopics: ["Software Metrics: LOC, Function Point (FP) Analysis","COCOMO I and COCOMO II Estimation Models","Software Quality Assurance (ISO 9001, CMMI Levels)","Maintenance Types (Corrective, Adaptive, Perfective, Preventive)"],
      fatWeightage: 16,
    },
  ],

  // CSE1006: Foundations for Data Analytics
  CSE1006: [
    {
      moduleNumber: 1,
      name: "Introduction to Data Analytics & Ecosystem",
      coreTopics: ["Data Types: Structured, Semi-Structured and Unstructured","Data Analytics Lifecycle (CRISP-DM Framework)","Statistical Foundations: Central Tendency, Dispersion, Outliers","Python Analytics Stack: NumPy arrays, Pandas DataFrames"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Data Preprocessing & Feature Engineering",
      coreTopics: ["Handling Missing Values (Imputation Techniques)","Data Normalization and Standardization (Min-Max, Z-score)","Categorical Encoding (One-Hot, Ordinal, Target Encoding)","Feature Selection: Filter, Wrapper, and Embedded Methods"],
      fatWeightage: 22,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Exploratory Data Analysis (EDA) & Visualization",
      coreTopics: ["Univariate, Bivariate, and Multivariate Analysis","Data Visualizations with Matplotlib and Seaborn","Correlation Analysis (Pearson, Spearman) & Heatmaps","Dimensionality Reduction via Principal Component Analysis (PCA)"],
      fatWeightage: 22,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 4,
      name: "Predictive Analytics & Supervised Models",
      coreTopics: ["Linear and Multiple Regression Formulation","Logistic Regression for Binary Classification","Decision Trees and Random Forest Classifiers","Evaluation Metrics: Precision, Recall, F1-Score, ROC-AUC"],
      fatWeightage: 22,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 5,
      name: "Unsupervised Analytics & Big Data Overview",
      coreTopics: ["K-Means Clustering and Elbow Method for Optimal K","Hierarchical Agglomerative Clustering and Dendrograms","Association Rule Mining (Apriori Algorithm, Support, Confidence)","Introduction to Hadoop, MapReduce and Spark Concepts"],
      fatWeightage: 16,
    },
  ],

  // CSE1008: Theory of Computation
  CSE1008: [
    {
      moduleNumber: 1,
      name: "Finite Automata & Regular Languages",
      coreTopics: ["Deterministic Finite Automata (DFA) Construction","Non-Deterministic Finite Automata (NFA) with Epsilon Moves","NFA to DFA Subset Construction Algorithm","DFA State Minimization using Table-Filling (Myhill-Nerode)"],
      fatWeightage: 16,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Regular Expressions & Pumping Lemma",
      coreTopics: ["Regular Expressions and Finite Automata Equivalence (Arden Rule)","Pumping Lemma for Regular Languages and Proofs of Non-Regularity","Closure Properties of Regular Languages (Union, Intersection, Complement)","Decision Properties of Regular Languages"],
      fatWeightage: 22,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Context-Free Grammars & Normal Forms",
      coreTopics: ["Context-Free Grammars (CFG) & Derivation Trees","Ambiguity in Grammars & Inherent Ambiguity","Simplification of CFG: Eliminating Useless, Null, and Unit Productions","Chomsky Normal Form (CNF) & Greibach Normal Form (GNF)"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Pushdown Automata (PDA)",
      coreTopics: ["Pushdown Automata: Acceptance by Final State vs Empty Stack","Equivalence of CFG and PDA Constructions","Deterministic PDA (DPDA) vs Non-Deterministic PDA","Pumping Lemma for Context-Free Languages and Non-CFL Proofs"],
      fatWeightage: 20,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Turing Machines & Decidability",
      coreTopics: ["Standard Turing Machine Architecture & Formal Definition","Turing Machine Construction for Arithmetic and Language Recognition","Chomsky Hierarchy of Formal Languages","Halting Problem of Turing Machines & Rice Theorem / Undecidability"],
      fatWeightage: 18,
    },
  ],

  // CSE1012: Problem Solving using Python
  CSE1012: [
    {
      moduleNumber: 1,
      name: "Problem Solving & Control Constructs",
      coreTopics: ["Flowcharts & Pseudocode","Data Types & Numeric Operators","Conditional Branching (if-elif-else)","Iterative Loops (for, while, range)"],
      fatWeightage: 14,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Functions, Scoping & Recursion",
      coreTopics: ["Function Definition & Return Values","Default, Keyword & *args/**kwargs Arguments","Recursion & Base Case Verification","Lambda Functions & Higher-Order (map, filter)"],
      fatWeightage: 16,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Composite Data Structures",
      coreTopics: ["Lists, Slicing & List Comprehensions","Tuples & Immutability","Dictionaries & Nested Record Aggregation","Sets & Mathematical Operations"],
      fatWeightage: 28,
      cat2Weightage: 28,
    },
    {
      moduleNumber: 4,
      name: "File Operations & Exception Handling",
      coreTopics: ["File I/O with Context Managers (\"with\")","CSV File Parsing & Data Extraction","try-except-else-finally Error Handling","Custom Exceptions Hierarchy"],
      fatWeightage: 22,
      cat2Weightage: 22,
    },
    {
      moduleNumber: 5,
      name: "Modules, Regex & OOP Basics",
      coreTopics: ["Regular Expressions (re module)","Classes, Objects, and __init__ Constructor","Encapsulation, Inheritance & Polymorphism","Standard Libraries (math, random, os)"],
      fatWeightage: 20,
    },
  ],

  // CSE2001: Data Structures and Algorithms
  CSE2001: [
    {
      moduleNumber: 1,
      name: "Linear Structures: Arrays, Stacks & Queues",
      coreTopics: ["Asymptotic Complexity Analysis (Big-O, Omega, Theta)","Stack Applications: Infix to Postfix & Evaluation","Circular Queues & Deque Implementation","Singly, Doubly, and Circular Linked Lists"],
      fatWeightage: 16,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Non-Linear Structures: Trees & BST",
      coreTopics: ["Binary Tree Properties & Traversals (Inorder, Preorder, Postorder)","Binary Search Tree (BST) Operations: Insertion, Deletion, Search","AVL Trees: Rotations (LL, RR, LR, RL) and Balancing","Binary Heaps: Min-Heap, Max-Heap & Heap Sort"],
      fatWeightage: 24,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Graph Algorithms & Traversals",
      coreTopics: ["Graph Representations: Adjacency Matrix vs List","Breadth-First Search (BFS) and Depth-First Search (DFS)","Topological Sorting & Directed Acyclic Graphs (DAG)","Minimum Spanning Trees: Kruskal and Prim Algorithms"],
      fatWeightage: 22,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Shortest Paths & Advanced Graph Design",
      coreTopics: ["Dijkstra's Single Source Shortest Path Algorithm","Bellman-Ford Algorithm with Negative Weight Cycles","Floyd-Warshall All-Pairs Shortest Path","Disjoint Set Union (DSU) with Path Compression"],
      fatWeightage: 20,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Hashing, Sorting & Search Paradigms",
      coreTopics: ["Hash Functions, Collision Resolution (Chaining, Open Addressing)","Comparison Sorts: Quick Sort with Partitioning, Merge Sort","Divide and Conquer vs Greedy vs Dynamic Programming Principles","B-Trees and B+ Trees Indexing Structures"],
      fatWeightage: 18,
    },
  ],

  // CSE2005: Object Oriented Programming using JAVA
  CSE2005: [
    {
      moduleNumber: 1,
      name: "Java Architecture & Language Constructs",
      coreTopics: ["JVM, JRE, JDK and Bytecode Execution","Primitive Types, Operators and Control Structures","Class Definitions, Object Instantiation and \"this\" Keyword","Method Overloading and Constructor Chaining"],
      fatWeightage: 16,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Inheritance, Polymorphism & Interfaces",
      coreTopics: ["Inheritance Types, \"super\" Keyword and Method Overriding","Dynamic Method Dispatch and Runtime Polymorphism","Abstract Classes vs Interfaces and Default Methods","Packages, Access Modifiers and Encapsulation"],
      fatWeightage: 22,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Exception Handling & Java I/O Streams",
      coreTopics: ["try, catch, finally, throw, and throws Keywords","Checked vs Unchecked Exceptions & Custom Exceptions","Byte Streams vs Character Streams (FileInputStream, BufferedReader)","Serialization and Deserialization with \"transient\""],
      fatWeightage: 22,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 4,
      name: "Multithreading & Concurrency in Java",
      coreTopics: ["Thread Lifecycle, Extending Thread vs Implementing Runnable","Thread Synchronization: synchronized Methods and Blocks","Inter-Thread Communication (wait, notify, notifyAll)","Deadlocks and Concurrency Utilities (ExecutorService)"],
      fatWeightage: 22,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 5,
      name: "Collections Framework & Generics",
      coreTopics: ["Generics: Generic Classes, Methods and Wildcards","List Interface: ArrayList, LinkedList, Vector","Set Interface: HashSet, LinkedHashSet, TreeSet","Map Interface: HashMap, TreeMap and Iterator Traversals"],
      fatWeightage: 18,
    },
  ],

  // CSE2007: Database Management Systems
  CSE2007: [
    {
      moduleNumber: 1,
      name: "Data Models & Relational Algebra",
      coreTopics: ["Three-Schema Database Architecture & Data Independence","Entity-Relationship (ER) Modeling & Crow-Foot Notation","Enhanced ER (EER) Specialization and Generalization","Relational Algebra Operations: Selection, Projection, Joins, Division"],
      fatWeightage: 16,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "SQL & Relational Query Formulation",
      coreTopics: ["DDL, DML, DCL and TCL Commands","Complex Queries with Subqueries, Correlated Subqueries & Exists","Aggregate Functions, GROUP BY, and HAVING Clauses","Views, Triggers, Stored Procedures, and Integrity Constraints"],
      fatWeightage: 22,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Relational Design & Normalization",
      coreTopics: ["Functional Dependencies and Armstrong Axioms","First, Second, and Third Normal Forms (1NF, 2NF, 3NF)","Boyce-Codd Normal Form (BCNF) Decomposition","Lossless Join and Dependency Preserving Decompositions"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Transaction Management & Concurrency Control",
      coreTopics: ["ACID Properties of Database Transactions","Serializability: Conflict Serializability and Precedence Graphs","Two-Phase Locking (2PL) Protocols (Strict and Rigorous 2PL)","Deadlock Handling: Wait-Die, Wound-Wait and Detection"],
      fatWeightage: 22,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Indexing, Storage & Recovery Mechanisms",
      coreTopics: ["File Organization: Heap, Sorted, and Hashed Files","B-Tree and B+ Tree Index Structures (Search, Insert, Delete)","Log-Based Recovery: Immediate vs Deferred Database Modification","Checkpoints and ARIES Recovery Algorithm"],
      fatWeightage: 16,
    },
  ],

  // CSE2008: Operating Systems
  CSE2008: [
    {
      moduleNumber: 1,
      name: "OS Architecture & Process Management",
      coreTopics: ["System Calls & Dual Mode Operation","Process State Transitions & PCB","Inter-Process Communication (IPC)","Multithreading Models & Benefits"],
      fatWeightage: 14,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "CPU Scheduling & Synchronization",
      coreTopics: ["CPU Scheduling (FCFS, SJF, Priority, Round Robin)","Critical Section Problem & Race Conditions","Peterson's Algorithm for Mutual Exclusion","Counting & Binary Semaphores (wait/signal)"],
      fatWeightage: 26,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Deadlocks & Resource Allocation",
      coreTopics: ["Coffman Conditions for Deadlock","Resource Allocation Graph (RAG)","Banker's Safety Algorithm & Resource Request","Deadlock Detection & Recovery Strategies"],
      fatWeightage: 18,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Memory Management & Paging",
      coreTopics: ["Logical vs Physical Address & MMU","Paging, Page Tables, and TLB Hit Ratio","Page Replacement (FIFO, LRU, Optimal)","Belady's Anomaly & Thrashing Prevention"],
      fatWeightage: 24,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Storage, File Systems & Disk Scheduling",
      coreTopics: ["UNIX Inode Architecture & File Allocation","Free Space Management (Bit Vector, Linked List)","Disk Scheduling (FCFS, SSTF, SCAN, C-LOOK)","RAID Levels & Fault Tolerance"],
      fatWeightage: 18,
    },
  ],

  // CSE2009: Soft Computing
  CSE2009: [
    {
      moduleNumber: 1,
      name: "Introduction to Soft Computing & Fuzzy Logic",
      coreTopics: ["Hard Computing vs Soft Computing Paradigms","Fuzzy Sets vs Crisp Sets & Membership Functions","Operations on Fuzzy Sets: Union, Intersection, Complement","Fuzzy Relations & Max-Min Composition"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Fuzzy Inference Systems (FIS)",
      coreTopics: ["Fuzzy Linguistic Variables and Hedge Rules","Mamdani and Sugeno Fuzzy Inference Systems","Fuzzification and Defuzzification Techniques (Centroid, COG)","Applications in Control Systems and Decision Support"],
      fatWeightage: 20,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Artificial Neural Networks: Perceptrons & MLP",
      coreTopics: ["Biological Neuron vs Artificial Neuron Models","Single-Layer Perceptron and Linear Separability (XOR Problem)","Multilayer Perceptron (MLP) Architecture","Backpropagation Algorithm and Weight Update Derivation"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Specialized Neural Architectures",
      coreTopics: ["Radial Basis Function (RBF) Networks","Kohonen Self-Organizing Feature Maps (SOM)","Hopfield Associative Memory Networks","Recurrent Neural Networks (RNN) and Autoencoders"],
      fatWeightage: 22,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Genetic Algorithms (GA) & Swarm Optimization",
      coreTopics: ["Biological Evolution Analogy & GA Flowchart","Encoding Schemes, Selection Methods (Roulette Wheel, Tournament)","Crossover (Single-point, Uniform) and Mutation Operators","Particle Swarm Optimization (PSO) and Hybrid Neuro-Fuzzy Systems"],
      fatWeightage: 16,
    },
  ],

  // CSE2027: SD&A (System Design and Architecture)
  CSE2027: [
    {
      moduleNumber: 1,
      name: "System Design Fundamentals & Scalability",
      coreTopics: ["Horizontal vs Vertical Scaling Paradigms","Latency, Throughput, and Performance Metrics","CAP Theorem (Consistency, Availability, Partition Tolerance)","ACID vs BASE Eventual Consistency"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Load Balancing & Caching Strategies",
      coreTopics: ["Load Balancing Algorithms (Round Robin, Least Connections, Consistent Hashing)","Reverse Proxies vs Forward Proxies (Nginx, HAProxy)","Distributed Caching (Redis, Memcached) & Cache Eviction (LRU, LFU)","Cache Invalidation Strategies (Write-Through, Write-Back, Cache-Aside)"],
      fatWeightage: 22,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Distributed Storage & Partitioning",
      coreTopics: ["Database Sharding & Consistent Hashing Rings","Master-Slave vs Multi-Master Replication","SQL vs NoSQL (Document, Key-Value, Columnar, Graph)","WAL (Write-Ahead Logging) and Distributed Consensus (Raft/Paxos)"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Asynchronous Messaging & Microservices",
      coreTopics: ["Message Queues & Event Streaming (Kafka, RabbitMQ)","Publish-Subscribe vs Point-to-Point Messaging Patterns","API Gateways, Service Discovery and Circuit Breakers","REST vs GraphQL vs gRPC Protocols"],
      fatWeightage: 20,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "System Design Case Studies",
      coreTopics: ["Designing a Distributed URL Shortener (TinyURL)","Designing a Rate Limiter (Token Bucket, Leaky Bucket)","Designing a Collaborative Document Editor / Chat App","Designing a Distributed Web Crawler and Metric Monitoring Service"],
      fatWeightage: 16,
    },
  ],

  // CSE3002: Artificial Intelligence
  CSE3002: [
    {
      moduleNumber: 1,
      name: "Intelligent Agents & Problem Formulation",
      coreTopics: ["Agents and Environments (PEAS Framework)","Agent Architectures: Simple Reflex, Goal-Based, Utility-Based","State Space Representation & Toy Problems (8-Puzzle, Water Jug)","Uninformed Search: BFS, DFS, Uniform Cost Search (UCS), Iterative Deepening"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Informed Search & Adversarial Games",
      coreTopics: ["Heuristic Functions and Admissibility Criteria","A* Search Algorithm and Optimality Proof","Greedy Best-First Search and Hill Climbing (Local Maxima, Plateaus)","Minimax Algorithm and Alpha-Beta Pruning in Games"],
      fatWeightage: 24,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Constraint Satisfaction & Knowledge Representation",
      coreTopics: ["Constraint Satisfaction Problems (CSP): Backtracking and Forward Checking","Arc Consistency (AC-3 Algorithm)","Propositional Logic & First-Order Predicate Logic (FOL)","Forward Chaining, Backward Chaining, and Resolution Refutation"],
      fatWeightage: 20,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 4,
      name: "Reasoning under Uncertainty & Probabilistic Models",
      coreTopics: ["Handling Uncertain Knowledge & Prior/Posterior Probabilities","Bayesian Networks: Conditional Independence and d-Separation","Inference in Bayesian Networks (Exact and Sampling)","Markov Decision Processes (MDP): Bellman Equations and Value Iteration"],
      fatWeightage: 22,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 5,
      name: "Planning & Introduction to Learning Agents",
      coreTopics: ["Classical Planning: STRIPS and PDDL Representation","State-Space Planning vs Plan-Space Planning","Reinforcement Learning: Q-Learning & Exploration vs Exploitation","Natural Language Processing Overview and Expert Systems"],
      fatWeightage: 16,
    },
  ],

  // CSE3003: Computer Networks
  CSE3003: [
    {
      moduleNumber: 1,
      name: "Network Topologies & Physical/Data Link Layers",
      coreTopics: ["OSI 7-Layer Model vs TCP/IP Protocol Stack","Circuit Switching vs Packet Switching","Framing, Error Detection (CRC, Checksum, Parity)","Flow Control: Stop-and-Wait, Go-Back-N, Selective Repeat ARQ"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Medium Access Control (MAC) Sublayer",
      coreTopics: ["Multiple Access Protocols: Pure & Slotted ALOHA","CSMA, CSMA/CD (Ethernet) & CSMA/CA (Wi-Fi)","Ethernet Standards (802.3) and Switching Topologies","VLANs and Spanning Tree Protocol (STP)"],
      fatWeightage: 20,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Network Layer & IP Addressing",
      coreTopics: ["IPv4 Addressing, Subnetting, VLSM and Supernetting (CIDR)","IPv6 Architecture and Transition Mechanisms","Routing Protocols: Distance Vector (Bellman-Ford, Count-to-Infinity)","Link State Routing (Dijkstra, OSPF) & BGP Overview"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Transport Layer Protocols",
      coreTopics: ["User Datagram Protocol (UDP) Header & Use Cases","TCP Header, Connection Management (3-Way Handshake & Teardown)","TCP Congestion Control (Slow Start, AIMD, Fast Retransmit/Recovery)","TCP Flow Control (Sliding Window & Silly Window Syndrome)"],
      fatWeightage: 22,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Application Layer & Network Security",
      coreTopics: ["Domain Name System (DNS) Resolution Hierarchy","HTTP/HTTPS, SMTP, POP3/IMAP, and FTP Protocols","Public Key Cryptography (RSA) and SSL/TLS Handshake","Firewalls, NAT (Network Address Translation), and Packet Filtering"],
      fatWeightage: 16,
    },
  ],

  // CSE3004: Design and Analysis of Algorithms
  CSE3004: [
    {
      moduleNumber: 1,
      name: "Algorithm Analysis & Divide and Conquer",
      coreTopics: ["Recurrence Relations: Substitution, Recursion Tree, Master Method","Merge Sort and Quick Sort (Worst-case and Randomized Analysis)","Strassen Matrix Multiplication","Binary Search and Selection in Linear Time (Median of Medians)"],
      fatWeightage: 16,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Greedy Strategy & Optimal Solutions",
      coreTopics: ["Greedy Choice Property and Optimal Substructure","Activity Selection / Interval Scheduling Problem","Fractional Knapsack Problem","Huffman Coding for Data Compression & Prim/Kruskal MST"],
      fatWeightage: 22,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Dynamic Programming Paradigm",
      coreTopics: ["0/1 Knapsack Problem with Memoization and Bottom-Up Tables","Longest Common Subsequence (LCS) and Edit Distance","Matrix Chain Multiplication (Parenthesization Optimality)","All-Pairs Shortest Path (Floyd-Warshall Algorithm)"],
      fatWeightage: 26,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Backtracking & Branch and Bound",
      coreTopics: ["N-Queens Problem and State-Space Tree Exploration","Subset Sum and Hamiltonian Cycle Problems","0/1 Knapsack using Branch and Bound (LCBB)","Traveling Salesperson Problem (TSP) using Cost Bounds"],
      fatWeightage: 20,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "NP-Completeness & Approximation Algorithms",
      coreTopics: ["Classes P, NP, NP-Hard, and NP-Complete","Polynomial Time Reductions & Cook-Levin Theorem","Classic NP-Complete Problems: 3-SAT, Vertex Cover, Clique, Subset Sum","Vertex Cover Approximation and Traveling Salesperson (2-Approximation)"],
      fatWeightage: 16,
    },
  ],

  // CSE3006: Data Visualization
  CSE3006: [
    {
      moduleNumber: 1,
      name: "Visual Perception & Foundations of Visual Design",
      coreTopics: ["Preattentive Visual Attributes (Length, Position, Hue, Density)","Gestalt Principles of Visual Perception","Marks and Channels & Effectiveness Criteria (Mackinlay Hierarchy)","Color Models (RGB, HSL, ColorBrewer Palettes) & Accessibility"],
      fatWeightage: 18,
      cat1Weightage: 25,
    },
    {
      moduleNumber: 2,
      name: "Tabular & Relational Data Visualizations",
      coreTopics: ["Visualizing Distributions: Histograms, KDE, Box/Violin Plots","Visualizing Proportions: Stacked Bars, Treemaps, Donut Charts","Visualizing Trends: Line Charts, Area Charts, Sparklines","Scatter Plots, Bubble Charts, and Correlation Matrices"],
      fatWeightage: 20,
      cat1Weightage: 25,
    },
    {
      moduleNumber: 3,
      name: "Geospatial & Temporal Visualizations",
      coreTopics: ["Choropleth Maps and Tile Grams","Proportional Symbol Maps and Dot Density Plots","Flow Maps and Origin-Destination Visualizations","Temporal Spirals, Heatmaps, and Horizon Graphs"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Hierarchical, Network & High-Dimensional Data",
      coreTopics: ["Node-Link Diagrams and Force-Directed Graph Layouts","Adjacency Matrices for Dense Graphs","Treemaps, Sunburst Charts and Dendrograms","Parallel Coordinates and Radar Charts for Multidimensional Data"],
      fatWeightage: 22,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Interactive Dashboards & Modern Tooling",
      coreTopics: ["Interaction Techniques: Brushing, Linking, Filtering, Zooming","Dashboard Design Principles & Cognitive Load Optimization","Visual Storytelling and Scrollytelling Patterns","Visualization Libraries: D3.js, Vega-Lite, Tableau, Plotly"],
      fatWeightage: 16,
    },
  ],

  // CSE3008: Introduction to Machine Learning
  CSE3008: [
    {
      moduleNumber: 1,
      name: "Statistical Foundations & Regression Models",
      coreTopics: ["Supervised vs Unsupervised vs Reinforcement Learning","Simple and Multiple Linear Regression (Closed-Form Normal Equation)","Gradient Descent Optimization (Batch, Stochastic, Mini-Batch)","Bias-Variance Tradeoff, Overfitting, and Regularization (Lasso L1, Ridge L2)"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Linear Classification Models",
      coreTopics: ["Logistic Regression and Sigmoid Activation","Maximum Likelihood Formulation for Binary Cross-Entropy","Linear Discriminant Analysis (LDA) and Fisher Criterion","Support Vector Machines (SVM): Maximum Margin Classifier & Soft Margins"],
      fatWeightage: 22,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Non-Linear Models & Kernel Methods",
      coreTopics: ["Kernel Trick in SVM: Polynomial, RBF, and Sigmoidal Kernels","K-Nearest Neighbors (KNN) Classifier and Distance Metrics","Decision Trees: ID3, C4.5, and CART (Gini Impurity, Information Gain)","Tree Pruning Strategies to Mitigate Overfitting"],
      fatWeightage: 22,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 4,
      name: "Ensemble Learning & Bagging/Boosting",
      coreTopics: ["Bootstrap Aggregation (Bagging) & Random Forests","Feature Importance & Out-of-Bag (OOB) Error Evaluation","Boosting Algorithms: AdaBoost and Gradient Boosting Machines (GBM)","XGBoost Principles and Hyperparameter Tuning (Grid Search, Random Search)"],
      fatWeightage: 22,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 5,
      name: "Clustering & Dimensionality Reduction",
      coreTopics: ["K-Means Clustering and K-Means++ Initialization","Hierarchical Agglomerative Clustering and Linkage Criteria","Gaussian Mixture Models (GMM) and Expectation-Maximization (EM)","Principal Component Analysis (PCA) Derivation via Covariance Matrix"],
      fatWeightage: 16,
    },
  ],

  // CSE3015: Natural Language Processing
  CSE3015: [
    {
      moduleNumber: 1,
      name: "Text Preprocessing & Linguistic Basics",
      coreTopics: ["Tokenization, Stemming (Porter), and Lemmatization (WordNet)","Stop Word Removal, Regex Matching, and Sentence Boundary Detection","N-gram Language Models and Maximum Likelihood Estimation","Smoothing Techniques: Laplace (Add-1), Good-Turing, and Kneser-Ney"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Part-of-Speech Tagging & Parsing",
      coreTopics: ["Part-of-Speech (POS) Tagsets (Penn Treebank)","Hidden Markov Models (HMM) for Sequence Labeling","Viterbi Decoding Algorithm for POS Tagging","Syntactic Parsing: Context-Free Grammars and Cocke-Younger-Kasami (CYK) Algorithm"],
      fatWeightage: 22,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Word Embeddings & Distributed Representations",
      coreTopics: ["One-Hot Encoding vs Distributed Semantic Vectors","TF-IDF (Term Frequency-Inverse Document Frequency)","Word2Vec: Continuous Bag-of-Words (CBOW) and Skip-Gram with Negative Sampling","GloVe (Global Vectors for Word Representation) and FastText"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Sequential Deep Learning for NLP",
      coreTopics: ["Recurrent Neural Networks (RNN) for Sequence Classification","Vanishing and Exploding Gradient Problems in Language Tasks","Long Short-Term Memory (LSTM) Networks and Gated Recurrent Units (GRU)","Sequence-to-Sequence (Seq2Seq) Architecture with Encoder-Decoder"],
      fatWeightage: 20,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Attention Mechanisms & Modern Transformers",
      coreTopics: ["Bahdanau Additive Attention & Luong Multiplicative Attention","Self-Attention and Scaled Dot-Product Attention in Transformers","Multi-Head Attention and Positional Encoding","Pre-trained Language Models: BERT, GPT, T5 and Transfer Learning"],
      fatWeightage: 16,
    },
  ],

  // CSE4006: Deep Learning
  CSE4006: [
    {
      moduleNumber: 1,
      name: "Neural Networks & Optimization Foundations",
      coreTopics: ["Feedforward Networks, Activation Functions (ReLU, Leaky ReLU, GeLU, Softmax)","Loss Functions: Cross-Entropy, Mean Squared Error, CTC","Backpropagation and Computational Graphs","Optimization Algorithms: SGD with Momentum, RMSprop, Adam"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Convolutional Neural Networks (CNN)",
      coreTopics: ["Convolution Operations, Stride, Padding, and Receptive Fields","Pooling Layers (Max Pooling, Average Pooling) & Downsampling","Classic Architectures: LeNet-5, AlexNet, VGG-16, and ResNet (Residual Skip Connections)","Inception Modules and Depthwise Separable Convolutions (MobileNet)"],
      fatWeightage: 24,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Regularization & Training Stability",
      coreTopics: ["Batch Normalization and Layer Normalization Mechanics","Dropout Regularization and Inverted Dropout","Weight Initialization: Xavier (Glorot) and He Initialization","Early Stopping, Data Augmentation, and Learning Rate Schedulers"],
      fatWeightage: 20,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 4,
      name: "Recurrent Architectures & Sequence Models",
      coreTopics: ["Bidirectional LSTMs and Deep Sequential Pipelines","Attention Mechanism in Deep Sequence Modeling","Transformer Architecture (Encoder-Decoder Stacks)","Vision Transformers (ViT) for Image Recognition"],
      fatWeightage: 22,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 5,
      name: "Generative Models & Unsupervised Learning",
      coreTopics: ["Autoencoders (Undercomplete, Denoising, Sparse)","Variational Autoencoders (VAE) and Reparameterization Trick","Generative Adversarial Networks (GANs): Generator and Discriminator Games","Diffusion Models and Stable Generation Principles"],
      fatWeightage: 16,
    },
  ],

  // CSE4007: Digital Image Processing
  CSE4007: [
    {
      moduleNumber: 1,
      name: "Image Representation & Spatial Filtering",
      coreTopics: ["Digital Image Formation, Sampling, and Quantization","Spatial Resolution, Grayscale Dynamic Range and Connectivity","Intensity Transformations: Contrast Stretching, Histogram Equalization","Spatial Smoothing Filters (Mean, Gaussian, Median) and Sharpening (Laplacian, Sobel)"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Frequency Domain Processing",
      coreTopics: ["2D Discrete Fourier Transform (DFT) and Properties","Frequency Domain Filtering: Low-Pass (Ideal, Butterworth, Gaussian)","High-Pass Filtering and Edge Enhancement in Frequency Domain","Homomorphic Filtering for Illumination-Reflectance Correction"],
      fatWeightage: 22,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Image Restoration & Morphological Operations",
      coreTopics: ["Image Degradation/Restoration Model & Noise Models (Gaussian, Salt & Pepper)","Inverse Filtering and Wiener Deconvolution Filtering","Morphological Operations: Dilation, Erosion, Opening, Closing","Hit-or-Miss Transform, Boundary Extraction, and Skeletonization"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Image Segmentation Techniques",
      coreTopics: ["Point, Line and Edge Detection (Canny Edge Detector Steps)","Thresholding Methods: Global, Adaptive, and Otsu Automated Thresholding","Region-Based Segmentation: Region Growing, Region Splitting and Merging","Watershed Segmentation Algorithm"],
      fatWeightage: 20,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Color Image Processing & Compression",
      coreTopics: ["Color Models: RGB, CMYK, HSI and YCbCr","Pseudocolor Image Processing and Full-Color Transformations","Image Compression Redundancies (Coding, Interpixel, Psychovisual)","JPEG Compression Standard (DCT, Quantization, Huffman Encoding)"],
      fatWeightage: 16,
    },
  ],

  // SWE1002: Principles of Software Engineering
  SWE1002: [
    {
      moduleNumber: 1,
      name: "Software Processes & Lifecycle Methodologies",
      coreTopics: ["Software Crisis & Engineering Principles","Linear Sequential (Waterfall) vs Iterative Incremental Models","Agile Principles & Scrum Workflow","Kanban Boards and Lean Development Concepts"],
      fatWeightage: 18,
      cat1Weightage: 25,
    },
    {
      moduleNumber: 2,
      name: "Requirement Engineering & Analysis",
      coreTopics: ["Functional and Non-Functional Requirements Specification","Requirement Elicitation: User Stories, Use Cases, Prototypes","Data Flow Diagrams (DFD Level 0, 1, 2)","IEEE 830 Standard for Software Requirements Specification (SRS)"],
      fatWeightage: 20,
      cat1Weightage: 25,
    },
    {
      moduleNumber: 3,
      name: "System Modeling with UML",
      coreTopics: ["Structural Diagrams: Class, Object, Package Diagrams","Behavioral Diagrams: Sequence Diagrams, Collaboration Diagrams","State Machine & Activity Diagrams","Component & Deployment Diagrams for Hardware-Software Mapping"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Software Verification & Testing Frameworks",
      coreTopics: ["Software Testing Levels: Unit, Integration, System, Acceptance","Black-Box Testing: Equivalence Partitioning & Boundary Value Analysis","White-Box Testing: Cyclomatic Complexity & Path Coverage","Automated Testing and Continuous Integration (CI/CD)"],
      fatWeightage: 22,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Software Project Management & Quality",
      coreTopics: ["Effort Estimation: Function Point Analysis & COCOMO Model","Risk Analysis, Mitigation and Monitoring (RMMM Plan)","Software Quality Models: McCall, Boehm, ISO 9126","Software Configuration Management (SCM) and Version Control (Git)"],
      fatWeightage: 16,
    },
  ],

  // SWE1004: Introduction to Programming in Python
  SWE1004: [
    {
      moduleNumber: 1,
      name: "Python Fundamentals & Control Flow",
      coreTopics: ["Basic Syntax & Operator Precedence","Conditionals (if-elif-else)","Loops (while, for with else)","Branching & Loop Control"],
      fatWeightage: 14,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Modular Programming & Functions",
      coreTopics: ["User Defined Functions","Variable Scope (Local vs Global)","Recursion Patterns","Higher-Order Functions"],
      fatWeightage: 16,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Sequences, Collections & Mappings",
      coreTopics: ["List Slicing & Mutability","Dictionary Manipulations","Tuple Packing & Unpacking","Set Theory Operations"],
      fatWeightage: 28,
      cat2Weightage: 28,
    },
    {
      moduleNumber: 4,
      name: "File Handling & Exception Management",
      coreTopics: ["File Stream Modes (r, w, a)","CSV & JSON File Parsing","Exception Hierarchy & Handlers","Assertions & Debugging"],
      fatWeightage: 22,
      cat2Weightage: 22,
    },
    {
      moduleNumber: 5,
      name: "Object-Oriented Design in Python",
      coreTopics: ["Classes & Object Instantiation","Inheritance & Method Overriding","Magic Methods (__str__, __len__)","Standard Utility Modules"],
      fatWeightage: 20,
    },
  ],

  // SWE2001: Data Structures and its Applications
  SWE2001: [
    {
      moduleNumber: 1,
      name: "Algorithmic Complexity & Linear Lists",
      coreTopics: ["Time and Space Complexity Analysis (Asymptotic Notations)","Array List Implementations and Dynamic Resizing","Singly, Doubly, and Circular Linked Lists","Polynomial Addition and Manipulation using Linked Lists"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Stacks, Queues & Practical Applications",
      coreTopics: ["Stack Operations & Array/Linked List Representation","Expression Evaluation: Infix, Prefix, Postfix Conversion","Recursion Simulation via Call Stack","Linear, Circular, and Priority Queues"],
      fatWeightage: 20,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Trees & Balanced Search Trees",
      coreTopics: ["Binary Tree Traversals (Recursive and Iterative)","Binary Search Tree (BST): Insert, Delete, Search Operations","AVL Trees: Rotations and Balance Factor Maintenance","Red-Black Tree Properties and B-Tree Overview"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Graphs & Real-World Network Algorithms",
      coreTopics: ["Graph Representations: Adjacency Matrix and Adjacency List","Breadth-First Search (BFS) and Depth-First Search (DFS)","Topological Sorting & Connected Components","Dijkstra and Prim Algorithms for Routing and Networks"],
      fatWeightage: 22,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Hashing Schemes & External Sorting",
      coreTopics: ["Hash Table Design & Collision Resolution Strategies","Separate Chaining vs Open Addressing (Linear, Quadratic, Double)","Merge Sort and Quick Sort Complexity Analysis","Heaps and Heap Sort Applications in Priority Systems"],
      fatWeightage: 16,
    },
  ],

  // SWE2002: Human Computer Interaction
  SWE2002: [
    {
      moduleNumber: 1,
      name: "Foundations of HCI & Cognitive Models",
      coreTopics: ["Human Sensory Capabilities (Vision, Hearing, Touch, Movement)","Memory Architecture: Sensory, Short-Term, and Long-Term Memory","Mental Models, Conceptual Models and Norman Action Cycle","Gestalt Laws of Perceptual Organization"],
      fatWeightage: 18,
      cat1Weightage: 25,
    },
    {
      moduleNumber: 2,
      name: "Interaction Paradigms & Design Principles",
      coreTopics: ["Direct Manipulation, Menu Selection, Form Fill-In, Command Language","Shneiderman's Eight Golden Rules of Interface Design","Nielsen's Ten Usability Heuristics","Affordance, Signifiers, Constraints, and Feedback"],
      fatWeightage: 22,
      cat1Weightage: 25,
    },
    {
      moduleNumber: 3,
      name: "User Research & Interaction Prototyping",
      coreTopics: ["User Personas, Empathy Maps, and Scenarios","Task Analysis: Hierarchical Task Analysis (HTA)","Low-Fidelity Prototyping (Paper Prototypes, Wireframes)","High-Fidelity Interactive Mockups & Design Systems"],
      fatWeightage: 22,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 4,
      name: "Usability Evaluation & Testing Methodologies",
      coreTopics: ["Expert Evaluation: Heuristic Evaluation & Cognitive Walkthrough","User Testing: Think-Aloud Protocol, Controlled Lab Studies","Quantitative Usability Metrics: SUS (System Usability Scale), Task Completion Rate","A/B Testing and Eye-Tracking Analytics"],
      fatWeightage: 22,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 5,
      name: "Ubiquitous, Mobile & Accessible Interfaces",
      coreTopics: ["Mobile UI Constraints (Touch Targets, Responsive Breakpoints)","Web Accessibility Guidelines (WCAG 2.1 Principles: POUR)","Voice User Interfaces (VUI) & Conversational Agents","Augmented and Virtual Reality (AR/VR) Interaction Patterns"],
      fatWeightage: 16,
    },
  ],

  // SWE2003: Requirements Engineering Management
  SWE2003: [
    {
      moduleNumber: 1,
      name: "Requirements Engineering Process Framework",
      coreTopics: ["Nature of Requirements: Functional vs Quality Attributes (NFRs)","Stakeholder Identification and Analysis Matrix","Requirements Engineering Lifecycle and Risk Assessment","Business Requirements vs User Requirements vs System Requirements"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Requirements Elicitation Techniques",
      coreTopics: ["Interviews, Surveys, Questionnaires, and Observation","Joint Application Development (JAD) Workshops","Prototyping as an Elicitation Mechanism","Storyboarding and User Journey Mapping"],
      fatWeightage: 20,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Requirements Modeling & Specification",
      coreTopics: ["Use Case Modeling, Actors and System Boundaries","Context Diagrams and Process Flow Models","Formal Specification Languages & Natural Language Ambiguities","IEEE 830 and ISO/IEC/IEEE 29148 SRS Standards"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Requirements Validation & Verification",
      coreTopics: ["Requirements Inspections, Reviews, and Walkthroughs","Requirements Testing and Acceptance Test Generation","Consistency, Completeness, and Realism Checks","Requirements Metrics for Volatility and Defect Density"],
      fatWeightage: 22,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Requirements Management & Traceability",
      coreTopics: ["Requirements Traceability Matrix (Forward and Backward Traceability)","Change Management Workflow & Change Control Board (CCB)","Tool Support for Requirements Management (Jira, DOORS)","Agile Backlog Grooming and User Story Slicing"],
      fatWeightage: 16,
    },
  ],

  // SWE2004: Software Design and Architecture
  SWE2004: [
    {
      moduleNumber: 1,
      name: "Software Architecture Foundations",
      coreTopics: ["Architectural Views and Perspectives (4+1 View Model)","Architectural Styles: Layered, Client-Server, Pipe-and-Filter","Event-Driven Architecture (EDA) & Publish-Subscribe","Quality Attributes (Performance, Modifiability, Security, Availability)"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Microservices & Distributed Architectural Patterns",
      coreTopics: ["Monolithic vs Microservice Architecture Trade-Offs","Domain-Driven Design (DDD): Bounded Contexts & Aggregates","Service Mesh (Istio), API Gateways, and Saga Distributed Transactions","Serverless (FaaS) Architecture Patterns"],
      fatWeightage: 22,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Creational & Structural Design Patterns",
      coreTopics: ["Creational Patterns: Singleton, Factory Method, Abstract Factory, Builder","Structural Patterns: Adapter, Facade, Decorator, Composite, Proxy","Applying SOLID Principles in Object-Oriented Frameworks","Refactoring Monolithic Code into Modular Designs"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Behavioral Design Patterns",
      coreTopics: ["Behavioral Patterns: Observer, Strategy, Command, Template Method","State and Chain of Responsibility Patterns","Model-View-Controller (MVC) and MVVM Frameworks","Anti-Patterns and Code Smells Identification"],
      fatWeightage: 20,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Architecture Evaluation & Documentation",
      coreTopics: ["Architecture Tradeoff Analysis Method (ATAM)","Software Architecture Analysis Method (SAAM)","Documenting Architecture: C4 Model (Context, Containers, Components, Code)","Architecture Compliance Checking and Technical Debt Management"],
      fatWeightage: 16,
    },
  ],

  // SWE2005: Concepts of Object Oriented Programming
  SWE2005: [
    {
      moduleNumber: 1,
      name: "Object-Oriented Paradigm & C++/Java Syntax",
      coreTopics: ["Procedural vs Object-Oriented Programming Paradigms","Classes, Objects, State, Behavior, and Identity","Encapsulation and Data Hiding using Access Specifiers","Constructors (Default, Parameterized, Copy) and Destructors"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Inheritance Hierarchies & Code Reuse",
      coreTopics: ["Single, Multiple, Multilevel, and Hierarchical Inheritance","Virtual Base Classes and Solving the Diamond Problem","Function Overriding and \"super\" / Base Class References","Abstract Classes and Pure Virtual Functions"],
      fatWeightage: 22,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Polymorphism & Dynamic Binding",
      coreTopics: ["Compile-Time Polymorphism: Function and Operator Overloading","Run-Time Polymorphism: Virtual Functions and VTABLE/VPTR","Early Binding vs Late Binding Mechanics","Friend Functions and Friend Classes"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Generic Programming & Templates",
      coreTopics: ["Function Templates and Class Templates","Template Specialization and Type Deductions","Standard Template Library (STL): Vectors, Lists, Maps, Iterators","STL Algorithms (sort, find, binary_search)"],
      fatWeightage: 20,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Exception Handling & Modern Object Design",
      coreTopics: ["Exception Propagation, try, catch, and throw Mechanism","Custom Exception Classes and Standard Exception Hierarchy","Object-Oriented Design Heuristics and Memory Management","Smart Pointers (unique_ptr, shared_ptr, weak_ptr) in C++"],
      fatWeightage: 16,
    },
  ],

  // SWE2006: Database Systems
  SWE2006: [
    {
      moduleNumber: 1,
      name: "Database Architecture & Relational Concepts",
      coreTopics: ["Database System Architecture (Internal, Conceptual, External)","Data Independence and Database Languages","Relational Model: Relations, Tuples, Attributes, and Keys (Primary, Foreign, Candidate)","Relational Algebra Operators: Selection, Projection, Joins, Set Operations"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "SQL Querying & Integrity Rules",
      coreTopics: ["Data Definition and Manipulation Queries","Nested Queries, Exists, and Correlated Subqueries","Aggregate Functions and Window Functions","Referential Integrity, Domain Constraints, and Assertion Checks"],
      fatWeightage: 22,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Normalization & Database Refinement",
      coreTopics: ["Functional Dependencies and Closure of Attribute Sets","Lossless Decomposition and Dependency Preservation","First, Second, and Third Normal Forms (1NF, 2NF, 3NF)","BCNF and 4NF with Multivalued Dependencies"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Transaction Management & Concurrency",
      coreTopics: ["Transaction States and ACID Compliance","Schedules: Serial, Serializable, and View Serializable","Locking Protocols: 2PL, Strict 2PL, Rigorous 2PL","Timestamp Ordering and Multi-Version Concurrency Control (MVCC)"],
      fatWeightage: 20,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Database Storage, Indexing & Query Processing",
      coreTopics: ["File Organization: Heap, Clustered, and Hashed Indexes","B+ Tree Index Construction and Maintenance","Query Optimization Steps and Relational Algebra Heuristics","Crash Recovery: WAL, Checkpointing, and Undo/Redo Logging"],
      fatWeightage: 16,
    },
  ],

  // SWE2007: Introduction to Operating Systems
  SWE2007: [
    {
      moduleNumber: 1,
      name: "Operating System Services & Process Abstraction",
      coreTopics: ["Operating System Structure: Monolithic, Microkernel, Layered","System Calls, POSIX API and Dual-Mode CPU Execution","Process Control Block (PCB) and Context Switching","Process Creation and Termination (fork, exec, wait, exit)"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Threads, CPU Scheduling & Concurrency",
      coreTopics: ["User-Level Threads vs Kernel-Level Threads","CPU Scheduling Criteria & Algorithms (FCFS, SJF, RR, Priority, Multilevel Feedback)","Synchronization: Critical Section, Mutex Locks, Semaphores","Classical Problems: Producer-Consumer, Dining Philosophers, Readers-Writers"],
      fatWeightage: 24,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Deadlock Characterization & Avoidance",
      coreTopics: ["Four Coffman Conditions for Deadlock","Resource Allocation Graphs and Cycle Detection","Deadlock Prevention Strategies","Banker's Algorithm for Deadlock Avoidance in Multi-Resource Systems"],
      fatWeightage: 20,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 4,
      name: "Memory Management & Virtual Memory",
      coreTopics: ["Swapping, Contiguous Allocation, Dynamic Storage Allocation (First, Best, Worst Fit)","Paging Hardware: Page Table Base Register (PTBR) and TLB","Virtual Memory: Demand Paging and Page Fault Handling","Page Replacement Algorithms: FIFO, Optimal, LRU, Clock (Second Chance)"],
      fatWeightage: 22,
      cat2Weightage: 25,
    },
    {
      moduleNumber: 5,
      name: "File Systems & Secondary Storage",
      coreTopics: ["File Attributes, File Operations, and Access Methods (Sequential, Direct)","Directory Structures: Single-Level, Two-Level, Tree-Structured","File Allocation: Contiguous, Linked, and Indexed Allocation (UNIX Inodes)","Disk Scheduling Algorithms: FCFS, SSTF, SCAN, LOOK, C-SCAN"],
      fatWeightage: 16,
    },
  ],

  // SWE2008: OOAD (Object Oriented Analysis and Design)
  SWE2008: [
    {
      moduleNumber: 1,
      name: "Object-Oriented Analysis Paradigms",
      coreTopics: ["OO Concepts Review: Objects, Classes, Polymorphism, Inheritance","Object-Oriented Development Life Cycle (RUP Framework)","Identifying Classes, Responsibilities, and Collaborators (CRC Cards)","Domain Modeling and Conceptual Class Diagrams"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Use Case Modeling & Interaction Analysis",
      coreTopics: ["Detailed Use Case Descriptions and Scenarios","System Sequence Diagrams (SSD) and System Operations","Operation Contracts: Preconditions and Postconditions","Activity Diagrams for Business Workflows"],
      fatWeightage: 22,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "GRASP Principles for Responsibility Assignment",
      coreTopics: ["General Responsibility Assignment Software Patterns (GRASP)","Creator, Information Expert, Low Coupling, High Cohesion","Controller, Polymorphism, Pure Fabrication, Indirection, Protected Variations","Designing Objects with GRASP Patterns"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "GoF Design Patterns in System Design",
      coreTopics: ["Creational Patterns: Factory Method, Singleton, Builder","Structural Patterns: Adapter, Facade, Decorator, Composite","Behavioral Patterns: Strategy, Observer, Command, State","Pattern Combinations in Real-World Enterprise Systems"],
      fatWeightage: 20,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "UML Implementation & Architectural Mapping",
      coreTopics: ["Interaction Diagrams to Code Mapping","Class Definitions and Method Signatures from Design Diagrams","State Machine Diagrams for Reactive and Complex Systems","Component and Deployment Architectures for Microservices"],
      fatWeightage: 16,
    },
  ],

  // SWE2009: Analysis of Algorithms
  SWE2009: [
    {
      moduleNumber: 1,
      name: "Mathematical Foundations & Asymptotic Complexity",
      coreTopics: ["Order of Growth and Big-O, Omega, Theta Notations","Solving Recurrence Equations: Master Theorem, Substitution, Recursion Tree","Amortized Analysis: Aggregate, Accounting, and Potential Methods","Analysis of Non-Recursive and Recursive Loops"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Divide and Conquer & Search Paradigms",
      coreTopics: ["Divide and Conquer Design: Merge Sort and Quick Sort","Randomized Algorithms and Las Vegas vs Monte Carlo Methods","Linear Time Selection: Median-of-Medians Algorithm","Closest Pair of Points in 2D Plane"],
      fatWeightage: 22,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Greedy Algorithms & Dynamic Programming",
      coreTopics: ["Matroids and Greedy Theoretical Foundations","Fractional Knapsack and Job Sequencing with Deadlines","Optimal Binary Search Trees (OBST)","Matrix Chain Multiplication and Longest Common Subsequence (LCS)"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Graph Algorithms & Network Flows",
      coreTopics: ["Shortest Paths: Bellman-Ford, Dijkstra, Floyd-Warshall","Maximum Flow Problem: Ford-Fulkerson Method and Edmonds-Karp","Max-Flow Min-Cut Theorem and Applications in Bipartite Matching","Eulerian and Hamiltonian Tour Formulations"],
      fatWeightage: 20,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Complexity Classes & Intractability",
      coreTopics: ["Turing Reducibility and Karp Polynomial Reductions","NP-Completeness: SAT, 3-SAT, Vertex Cover, Clique, Subset Sum","Approximation Algorithms for NP-Hard Optimization Problems","Branch and Bound vs Dynamic Programming Pruning"],
      fatWeightage: 16,
    },
  ],

  // SWE3001: Introduction to Computer Networks
  SWE3001: [
    {
      moduleNumber: 1,
      name: "Data Communications & Network Layering",
      coreTopics: ["Network Architectures: Peer-to-Peer vs Client-Server","OSI 7 Layers vs TCP/IP 4 Layers Comparison","Transmission Media: Guided (Twisted Pair, Coaxial, Fiber) and Unguided","Signal Impairments: Attenuation, Distortion, Noise and Shannon Capacity"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Data Link Layer & MAC Protocols",
      coreTopics: ["Framing Methods: Character Count, Byte Stuffing, Bit Stuffing","Error Detection: Parity, Checksum, CRC (Cyclic Redundancy Check)","Sliding Window Protocols: Stop-and-Wait, Go-Back-N, Selective Repeat","MAC Protocols: Pure/Slotted ALOHA, CSMA/CD, Ethernet (IEEE 802.3)"],
      fatWeightage: 22,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Network Layer & Routing Protocols",
      coreTopics: ["IPv4 Addressing, Subnet Masks, Classless Inter-Domain Routing (CIDR)","NAT, DHCP, ARP, and ICMP Control Protocols","Routing Algorithms: Distance Vector Routing (Bellman-Ford) and RIP","Link State Routing (Dijkstra) and OSPF / BGP Hierarchical Routing"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Transport Layer Protocols & Reliability",
      coreTopics: ["Port Numbers, Sockets, and Multiplexing/Demultiplexing","UDP: Datagram Format, Checksum, and Best-Effort Service","TCP: Connection Establishment (3-Way Handshake) and Termination","TCP Flow Control (Sliding Window) & Congestion Control (Tahoe, Reno)"],
      fatWeightage: 20,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Application Protocols & Network Security Basics",
      coreTopics: ["DNS Hierarchy, Record Types (A, CNAME, MX), and Iterative Queries","HTTP/1.1 vs HTTP/2 vs HTTP/3 and Web Caching","Email Protocols: SMTP, POP3, and IMAP","Symmetric vs Asymmetric Encryption, Digital Signatures, and Firewalls"],
      fatWeightage: 16,
    },
  ],

  // SWE3002: SWPM (Software Project Management)
  SWE3002: [
    {
      moduleNumber: 1,
      name: "Software Project Initiation & Feasibility",
      coreTopics: ["Projects vs Operations, Project Management Body of Knowledge (PMBOK)","Project Charter, Objectives, and Success Criteria","Technical, Operational, and Economic Feasibility Analysis","Cost-Benefit Analysis: NPV, ROI, and Payback Period"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Project Planning & Scope Management",
      coreTopics: ["Work Breakdown Structure (WBS) Creation and Decomposition","Activity Definition, Sequencing and Precedence Diagramming Method (PDM)","Critical Path Method (CPM) and PERT (Three-Point Estimation)","Gantt Charts and Resource Leveling Strategies"],
      fatWeightage: 22,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Software Effort & Cost Estimation",
      coreTopics: ["Parametric Estimation: COCOMO I and COCOMO II Models","Function Point (FP) and Use Case Point (UCP) Metrics","Agile Estimation: Planning Poker, Story Points, Velocity Tracking","Staffing Level Estimation and Rayleigh Curve"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Risk Management & Project Monitoring",
      coreTopics: ["Risk Identification, Risk Assessment Matrix, and Risk Exposure","Risk Mitigation, Monitoring and Management (RMMM Plan)","Earned Value Management (EVM): PV, EV, AC, CV, SV, CPI, SPI","Status Reporting, Burn-Down and Burn-Up Charts"],
      fatWeightage: 20,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Team Leadership, Quality & Contract Management",
      coreTopics: ["Team Development Models (Tuckman Stages of Group Development)","Software Quality Control (SQC) vs Quality Assurance (SQA)","Procurement and Contract Types: Fixed-Price, Time-and-Materials","Project Closeout, Post-Mortem Reviews, and Knowledge Capture"],
      fatWeightage: 16,
    },
  ],

  // SWE3004: Front End Design and Testing
  SWE3004: [
    {
      moduleNumber: 1,
      name: "Modern HTML5 & Semantic Web Architecture",
      coreTopics: ["HTML5 Semantic Elements (header, nav, main, article, section)","DOM Tree Structure and Browser Rendering Pipeline","Forms, Input Validation, and Accessibility Attributes (ARIA)","Responsive Viewport Meta Tags and Progressive Web App Manifests"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Advanced CSS3, Flexbox & Grid Layouts",
      coreTopics: ["CSS Box Model, Specificity, and Cascade Calculations","Flexbox Alignment, Distribution, and Responsive Wrapping","CSS Grid 2D Layouts, Template Areas, and Auto-Fit/Auto-Fill","CSS Transitions, Keyframe Animations, and Media Queries"],
      fatWeightage: 22,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "JavaScript ES6+ & DOM Manipulation",
      coreTopics: ["Arrow Functions, Destructuring, Spread/Rest Operators, Template Literals","Asynchronous JavaScript: Promises, async/await, and Event Loop","DOM Traversal, Event Bubbling, Capturing and Delegation","Client-Side Storage: LocalStorage, SessionStorage, IndexedDB"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Component Architecture & State in Modern Frameworks",
      coreTopics: ["Component-Based Architecture (React / Vue Paradigm)","Virtual DOM Reconciliation and Lifecycle Hooks","State Management Patterns (Props, Local State, Context API)","Routing, Code Splitting, and Performance Optimization (Lazy Loading)"],
      fatWeightage: 20,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Front-End Testing & Quality Assurance",
      coreTopics: ["Testing Pyramid: Unit, Integration, and End-to-End (E2E) Testing","Unit Testing Components with Jest and React Testing Library","End-to-End Test Automation with Cypress and Playwright","Lighthouse Auditing: Performance, SEO, Best Practices, Accessibility"],
      fatWeightage: 16,
    },
  ],

  // SWE4001: Internet and Web Technologies
  SWE4001: [
    {
      moduleNumber: 1,
      name: "Web Architecture & Protocol Standards",
      coreTopics: ["HTTP/HTTPS Request-Response Lifecycle and Status Codes","Stateless Architecture, Cookies, Sessions, and JWT Tokens","Web Servers (Apache, Nginx) and Reverse Proxy Configuration","DNS Resolution and Content Delivery Networks (CDN)"],
      fatWeightage: 18,
      cat1Weightage: 24,
    },
    {
      moduleNumber: 2,
      name: "Client-Side Scripting & Single-Page Apps (SPA)",
      coreTopics: ["JavaScript Prototypes, Closures, and Scoping Rules","AJAX, Fetch API, and Asynchronous Stream Handling","SPA Routing and Client-Side State Hydration","Progressive Web Apps: Service Workers, Caching Strategies, Offline Sync"],
      fatWeightage: 22,
      cat1Weightage: 26,
    },
    {
      moduleNumber: 3,
      name: "Server-Side Engineering with Node.js/Express",
      coreTopics: ["Node.js Event Loop, Non-Blocking I/O, and Libuv","Building RESTful APIs with Express Router and Middleware","Request Validation, Error Handling Middlewares, and Logging","Interfacing with Databases (Mongoose/MongoDB or Prisma/PostgreSQL)"],
      fatWeightage: 24,
      cat2Weightage: 26,
    },
    {
      moduleNumber: 4,
      name: "Web Security & Vulnerability Defense",
      coreTopics: ["Cross-Site Scripting (XSS): Stored, Reflected, DOM-Based and Prevention","Cross-Site Request Forgery (CSRF) & SameSite Cookie Policies","SQL Injection (SQLi) Defense via Parameterized Queries","CORS (Cross-Origin Resource Sharing) Configuration and Headers"],
      fatWeightage: 20,
      cat2Weightage: 24,
    },
    {
      moduleNumber: 5,
      name: "Cloud Deployment, WebSockets & Real-Time Web",
      coreTopics: ["Real-Time Bidirectional Communication with WebSockets and Socket.IO","Server-Sent Events (SSE) vs Long Polling","Containerization with Docker for Web Services","Cloud Deployment and CI/CD Pipelines (GitHub Actions, Cloud Run)"],
      fatWeightage: 16,
    },
  ],

};
