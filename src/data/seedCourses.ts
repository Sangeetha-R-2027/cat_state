import { ConceptLesson, Question, Flashcard, DocumentItem, TopicChat } from '../types';

export interface TopicCurriculum {
  id: string;
  title: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  summary: string;
  lessons: Record<string, ConceptLesson>; // keyed by teaching approach or default
  questions: Question[];
  reteachingQuestions: Question[]; // for post-adaptation evaluation
  flashcards: Flashcard[];
  sampleDocument?: DocumentItem;
  commonGaps: {
    triggerMistake: string;
    gapConcept: string;
    suggestedMethod: string;
    rationale: string;
  }[];
}

export const SEED_CURRICULA: Record<string, TopicCurriculum> = {
  'linked-lists-in-c': {
    id: 'linked-lists-in-c',
    title: 'Linked Lists in C',
    category: 'Computer Science & Data Structures',
    difficulty: 'intermediate',
    summary: 'Master dynamic memory allocation, node pointer linking, head/tail traversal, and pointer manipulation without memory leaks or segmentation faults.',
    lessons: {
      'step-by-step': {
        id: 'll-c-step',
        topicId: 'linked-lists-in-c',
        title: 'Singly Linked List Structure and Dynamic Allocation',
        subtitle: 'Foundations of dynamic node creation and pointer linking',
        teachingApproach: 'Step-by-Step Explanation',
        introduction: 'Unlike contiguous arrays, a linked list is a linear collection of data elements where order is not given by their physical placement in memory. Instead, each element points to the next.',
        explanation: `### Step 1: The Node Anatomy
A node in C is defined using a \`struct\` containing two distinct components:
1. The **data field**: stores the payload (e.g., \`int data;\`).
2. The **pointer field**: stores the memory address of the next struct node (\`struct Node* next;\`).

### Step 2: Dynamic Heap Allocation with \`malloc\`
When creating a node at runtime, you must request bytes from the operating system heap:
\`\`\`c
struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
if (newNode == NULL) {
    // Always guard against heap allocation failure
    fprintf(stderr, "Heap exhausted!\\n");
    return NULL;
}
newNode->data = 42;
newNode->next = NULL; // Crucial: terminate the link!
\`\`\`

### Step 3: Linking Nodes Together
To link the new node to an existing \`head\` pointer, we update pointer targets sequentially:
1. Point \`newNode->next\` to the current \`head\`.
2. Reassign \`head = newNode\`.
Notice the strict order: if you assign \`head = newNode\` first, you permanently lose access to the remainder of the list!`,
        keyTakeaways: [
          'Nodes consist of payload data and a self-referential struct pointer.',
          'Always check malloc return value for NULL before dereferencing.',
          'Always update newNode->next before reassigning the head pointer to avoid orphan leaks.',
          'Traversing requires a temporary cursor pointer (temp = temp->next) until temp == NULL.'
        ],
        visualDiagram: {
          type: 'ascii',
          title: 'Memory Layout: Head Pointer & Chained Nodes in Heap',
          caption: 'Visual representation of node memory addresses and pointer links.',
          diagram: `[ Head Pointer ]
      │
      ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Data: 10    │     │  Data: 25    │     │  Data: 42    │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ next: 0x2A40 ├────►│ next: 0x3F10 ├────►│ next: NULL   │
└──────────────┘     └──────────────┘     └──────────────┘
  (Addr: 0x10A0)       (Addr: 0x2A40)       (Addr: 0x3F10)`
        },
        examples: [
          {
            title: 'Prepending a Node (Insert at Head in O(1))',
            walkthrough: 'Allocate node -> assign data -> link next to old head -> update head to new node.',
            codeSnippet: `struct Node {
    int data;
    struct Node* next;
};

void push(struct Node** head_ref, int new_data) {
    struct Node* new_node = (struct Node*)malloc(sizeof(struct Node));
    if (!new_node) return;
    
    new_node->data = new_data;
    new_node->next = (*head_ref);
    (*head_ref) = new_node;
}`,
            explanation: 'We pass a double pointer (struct Node**) so that modifying (*head_ref) changes the actual caller pointer in main().'
          }
        ],
        socraticQuestion: 'What would happen in memory if we wrote `*head_ref = new_node;` BEFORE writing `new_node->next = (*head_ref);`?'
      },
      'visual-diagram': {
        id: 'll-c-visual',
        topicId: 'linked-lists-in-c',
        title: 'Visual Representation of Pointer Reassignment and Memory Addresses',
        subtitle: 'Geometric & diagram-first intuition for node manipulation',
        teachingApproach: 'Visual & Diagram-Based',
        introduction: 'Pointers in C can feel abstract until you picture them as physical arrows pointing to numbered storage lockers in heap memory.',
        explanation: `### Visualizing the Arrow Mechanics
Think of each node as a physical box with a tether:
- The \`next\` variable is simply a hand holding an arrow.
- Dereferencing (\`->\`) is physically walking along that arrow to open the destination locker.

\`\`\`
Before Insertion:
[ HEAD ] ──► [ Node A | next ] ──► [ Node B | NULL ]

Step A: Create Orphan Node
[ New Node | next = ? ]

Step B: Hook New Node to Node A's successor (Prevent Orphan Loss!)
[ New Node | next ] ──────────────┐
                                  ▼
[ HEAD ] ──► [ Node A | next ] ──► [ Node B | NULL ]

Step C: Reroute Node A's arrow
[ HEAD ] ──► [ Node A | next ] ──► [ New Node | next ] ──► [ Node B | NULL ]
\`\`\`

### Why Segmentation Faults Happen
A segfault occurs when your arrow points to Address \`0x0\` (\`NULL\`) or an unmapped memory region, and you try to open the locker (\`temp->data\`). Always check \`if (temp != NULL)\` before touching \`temp->data\`!`,
        keyTakeaways: [
          'Visualize every pointer variable as an arrow holding a memory address.',
          'Never sever a list link until the backup pointer is securely anchored.',
          'Dereferencing NULL (0x0) crashes your OS program with SIGSEGV immediately.',
          'Draw the boxes before writing single lines of C pointer code.'
        ],
        visualDiagram: {
          type: 'ascii',
          title: 'Pointer Reroute in Insertion Between Nodes',
          caption: 'Two-step pointer reconnecting to preserve chain continuity.',
          diagram: `     ┌──────────────────┐
     │  New Node: 15    │
     │  next ───────────┼──────┐
     └──────────────────┘      │
               ▲               │
               │ (2)           ▼ (1)
     ┌─────────┴────────┐     ┌──────────────┐
     │  Node A: 10      │     │  Node B: 20  │
     │  next (rerouted) │     │  next: NULL  │
     └──────────────────┘     └──────────────┘`
        },
        examples: [
          {
            title: 'Visual Node Traversal',
            walkthrough: 'Slide a cursor arrow from Head until it reaches a box pointing to NULL.',
            codeSnippet: `void printList(struct Node* n) {
    while (n != NULL) {
        printf("[%d] -> ", n->data);
        n = n->next; // move cursor arrow forward
    }
    printf("NULL\\n");
}`,
            explanation: 'Notice we pass struct Node* n by value; modifying n locally does not affect the caller head.'
          }
        ],
        socraticQuestion: 'If node B is deleted without freeing, where does its memory go?'
      },
      'analogy-based': {
        id: 'll-c-analogy',
        topicId: 'linked-lists-in-c',
        title: 'The Scavenger Hunt Analogy: Demystifying Linked Lists',
        subtitle: 'Understanding pointers through everyday intuitive metaphors',
        teachingApproach: 'Analogy-Based Teaching',
        introduction: 'Imagine participating in a treasure hunt where nobody knows the entire route in advance.',
        explanation: `### The Treasure Hunt Clue System
- **Array:** Like a row of hotel rooms 101, 102, 103 side-by-side. You immediately know room 103 is 2 doors down.
- **Linked List:** A scavenger hunt. You start at clue #1 (the \`Head\`). Clue #1 contains a secret token (the \`data\`) AND a piece of paper with the GPS coordinates of clue #2 (\`next\`).
- Clue #2 is hidden across town at the library. You must physically travel to clue #2 to read where clue #3 is hidden!
- When you reach the final clue, the paper says "END" (\`NULL\`).

### Inserting a New Clue in the Hunt
If you want to slip a bonus clue between Clue A and Clue B:
1. Write Clue B's location onto the new bonus clue.
2. Cross out Clue B's location on Clue A and write the bonus clue's location.
If you did it in reverse (erased Clue B from Clue A first), you would lose Clue B forever!`,
        keyTakeaways: [
          'Accessing element K requires following K sequential clues (O(n) time).',
          'Inserting or deleting at a known position is instant: just rewrite a clue card (O(1) time).',
          'NULL represents the terminal treasure chest at the end of the chain.'
        ],
        examples: [
          {
            title: 'Freeing the Entire List (Cleaning Up the Clues)',
            walkthrough: 'Save next clue before throwing away current clue.',
            codeSnippet: `void freeList(struct Node* head) {
    struct Node* current = head;
    struct Node* next_node;
    while (current != NULL) {
        next_node = current->next; // remember where next clue is!
        free(current);             // recycle current clue
        current = next_node;       // step to next
    }
}`,
            explanation: 'If you called free(current) before saving current->next, reading current->next is a Use-After-Free undefined behavior!'
          }
        ]
      }
    },
    questions: [
      {
        id: 'll-q1',
        type: 'mcq',
        concept: 'Pointer Reassignment Order',
        question: 'When prepending a new node to the head of a linked list, which step MUST occur first?',
        options: [
          'Set head = newNode;',
          'Set newNode->next = head;',
          'Free the old head node;',
          'Set newNode->next = NULL;'
        ],
        correctAnswer: 1,
        explanation: 'Setting newNode->next = head anchors the existing list. If you did head = newNode first, you would overwrite the head pointer and lose the entire chain.',
        hints: ['Think about what happens to the existing list if you reassign the head pointer first.'],
        difficulty: 'beginner'
      },
      {
        id: 'll-q2',
        type: 'code-debugging',
        concept: 'Segmentation Fault in Node Traversal',
        question: 'Identify and fix the bug in this C function that causes a segmentation fault when printing an empty or single-node list.',
        starterCode: `void printList(struct Node* head) {
    struct Node* curr = head;
    // BUG: Dereferencing curr->next before checking if curr itself is NULL!
    while (curr->next != NULL) {
        printf("%d -> ", curr->data);
        curr = curr->next;
    }
    printf("NULL\\n");
}`,
        targetBugDescription: 'Dereferencing curr->next when curr is NULL causes SIGSEGV on empty list, and skips printing the last node.',
        correctAnswer: `void printList(struct Node* head) {
    struct Node* curr = head;
    while (curr != NULL) {
        printf("%d -> ", curr->data);
        curr = curr->next;
    }
    printf("NULL\\n");
}`,
        explanation: 'The loop condition must be `curr != NULL`. Checking `curr->next != NULL` will crash if `head == NULL`, and will terminate prematurely without printing the final node.',
        hints: ['What happens if the function is called with head == NULL?', 'Does the loop condition print the last node whose next pointer is NULL?'],
        difficulty: 'intermediate'
      },
      {
        id: 'll-q3',
        type: 'explain-own-words',
        concept: 'Memory Leaks vs Dangling Pointers',
        question: 'Explain in your own words the difference between a Memory Leak and a Dangling Pointer in the context of C linked lists.',
        correctAnswer: 'A memory leak happens when heap memory is allocated with malloc but all pointers to it are lost without calling free(), wasting RAM. A dangling pointer happens when free() is called, but a pointer variable still holds that freed address, risking undefined behavior if accessed.',
        rubrics: [
          'Mentions malloc / heap allocation without free() for memory leak',
          'Mentions pointer still pointing to deallocated / freed memory for dangling pointer',
          'Accurately contrasts lost accessibility vs invalid memory access'
        ],
        explanation: 'Memory leaks waste system memory because the OS cannot reclaim lost heap blocks until exit. Dangling pointers point to invalid or repurposed memory, which causes subtle crashes or security vulnerabilities.',
        hints: ['One is about lost memory you can never touch again; the other is about touching memory you no longer own.'],
        difficulty: 'intermediate'
      }
    ],
    reteachingQuestions: [
      {
        id: 'll-ret-q1',
        type: 'mcq',
        concept: 'Visual Node Connection',
        question: 'In a visual node diagram where Node A (0x1000) points to Node B (0x2000), what value is stored in Node A->next?',
        options: [
          'The integer value stored in Node B',
          'The memory address 0x2000',
          'NULL',
          'The memory address 0x1000'
        ],
        correctAnswer: 1,
        explanation: 'Node A->next holds the memory address of the next struct in heap, which is 0x2000.',
        hints: ['Pointers store memory addresses, not data values.'],
        difficulty: 'beginner'
      },
      {
        id: 'll-ret-q2',
        type: 'short-answer',
        concept: 'Safe Node Deallocation',
        question: 'Before calling free(temp) on a node during list traversal, what must you save in a temporary pointer?',
        correctAnswer: 'temp->next',
        explanation: 'You must store temp->next in a temporary variable so you do not lose the address of the next node after freeing temp.',
        hints: ['What pointer tells you where the rest of the list lives?'],
        difficulty: 'beginner'
      }
    ],
    flashcards: [
      {
        id: 'fc-ll-1',
        topicId: 'linked-lists-in-c',
        question: 'What is the time complexity of inserting a node at the head of a linked list?',
        answer: 'O(1) constant time, because only the head reference and new node pointer need to be updated.',
        box: 1,
        nextReview: new Date().toISOString(),
        status: 'new'
      },
      {
        id: 'fc-ll-2',
        topicId: 'linked-lists-in-c',
        question: 'What occurs if you call free(head) before updating head = head->next?',
        answer: 'A Use-After-Free bug: accessing head->next after freeing head invokes undefined behavior.',
        box: 1,
        nextReview: new Date().toISOString(),
        status: 'new'
      },
      {
        id: 'fc-ll-3',
        topicId: 'linked-lists-in-c',
        question: 'Why do we use double pointers (struct Node** head_ref) when modifying the list head inside a function?',
        answer: 'C passes arguments by value. To modify the caller pointer variable in main(), we must pass its memory address.',
        box: 1,
        nextReview: new Date().toISOString(),
        status: 'new'
      }
    ],
    commonGaps: [
      {
        triggerMistake: 'Pointer Reassignment Order',
        gapConcept: 'Pointer Arithmetic & Heap Memory References',
        suggestedMethod: 'visual-diagram',
        rationale: 'The student struggled with sequential pointer overwriting. Switching to a Visual Diagram makes memory address arrows explicit before revisiting code.'
      },
      {
        triggerMistake: 'Segmentation Fault in Node Traversal',
        gapConcept: 'NULL Boundary Checks and Loop Invariants',
        suggestedMethod: 'worked-examples',
        rationale: 'The student confused curr->next with curr in while loops. Concrete worked examples tracing null termination step-by-step resolve this misconception.'
      }
    ],
    sampleDocument: {
      id: 'doc-ll-notes',
      name: 'Lecture_04_Pointers_and_Nodes.txt',
      size: '18 KB',
      type: 'notes',
      uploadedAt: 'Today, 10:15 AM',
      extractedText: `LECTURE 4: DYNAMIC DATA STRUCTURES & POINTER ARITHMETIC
Instructor: Dr. Vance, CS Department

1. MEMORY ARCHITECTURE REVIEW
Stack: Local variables, fast automatic cleanup, limited size.
Heap: Explicit allocation via malloc/calloc. Programmer responsible for free().
Pointer: A variable holding the 64-bit or 32-bit virtual address of another variable.

2. LINKED LIST ESSENTIALS
struct Node {
    int val;
    struct Node* next;
};
Rule 1: Always check for malloc failure:
struct Node* n = malloc(sizeof(struct Node));
if (!n) exit(1);

Rule 2: Never break the chain without a bridge!
When inserting:
new_node->next = prev_node->next; // Bridge built
prev_node->next = new_node;       // Link switched

3. COMMON EXAM TRAPS
- Off-by-one errors in while loops
- Memory leaks: failing to free allocated nodes before program terminates
- Dangling pointers: dereferencing freed memory`,
      summary: 'Lecture notes covering Stack vs Heap, struct Node definitions, safe insertion order, and pointer traps.',
      keyConcepts: ['Stack vs Heap', 'struct Node', 'malloc null check', 'Bridge-before-break rule', 'Dangling pointers'],
      isGroundingActive: true
    }
  },
  'binary-search-trees': {
    id: 'binary-search-trees',
    title: 'Binary Search Trees',
    category: 'Computer Science & Algorithms',
    difficulty: 'intermediate',
    summary: 'Explore BST invariants, recursive search, in-order tree traversals, and the three cases of node deletion.',
    lessons: {
      'step-by-step': {
        id: 'bst-step',
        topicId: 'binary-search-trees',
        title: 'The Binary Search Tree Property and Recursive Search',
        subtitle: 'Foundations of ordered tree hierarchy and logarithmic search',
        teachingApproach: 'Step-by-Step Explanation',
        introduction: 'A Binary Search Tree (BST) is a hierarchical data structure that organizes data so that searching, insertion, and deletion can achieve O(log n) average time complexity.',
        explanation: `### The Invariant Rule
For every node $X$ in a Binary Search Tree:
1. Every key in the **left subtree** of $X$ is strictly less than $X.key$.
2. Every key in the **right subtree** of $X$ is strictly greater than $X.key$.
3. Both left and right subtrees must themselves be valid BSTs.

### Step 1: Recursive Lookup
To search for target value $K$:
- If current node is \`NULL\`, $K$ does not exist in the tree.
- If $K == current.key$, search succeeded!
- If $K < current.key$, recursively search $current.left$.
- If $K > current.key$, recursively search $current.right$.

### Step 2: In-Order Traversal
Visiting nodes in the order (Left Subtree -> Current Root -> Right Subtree) always yields elements in strictly sorted ascending order!`,
        keyTakeaways: [
          'Left subtree keys < Root key < Right subtree keys for all subtrees.',
          'In-order traversal of a BST outputs elements in sorted order.',
          'Skewed trees (inserted in sorted order) degenerate to O(n) linked lists.'
        ],
        visualDiagram: {
          type: 'ascii',
          title: 'Binary Search Tree Hierarchy',
          caption: 'Visualizing BST invariant property around root 50.',
          diagram: `         [ 50 ]
        /      \\
     [ 30 ]    [ 70 ]
     /    \\    /    \\
   [20]  [40] [60]  [80]`
        },
        examples: [
          {
            title: 'Recursive BST Search in C++',
            walkthrough: 'Base cases: null pointer or found. Recursive step: branch left or right.',
            codeSnippet: `struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

TreeNode* searchBST(TreeNode* root, int target) {
    if (root == nullptr || root->val == target)
        return root;
    if (target < root->val)
        return searchBST(root->left, target);
    return searchBST(root->right, target);
}`,
            explanation: 'Halves the search space at each step in balanced trees, yielding O(log n) time.'
          }
        ]
      }
    },
    questions: [
      {
        id: 'bst-q1',
        type: 'mcq',
        concept: 'BST In-Order Traversal',
        question: 'Which tree traversal yields elements of a Binary Search Tree in sorted ascending order?',
        options: ['Pre-order', 'In-order', 'Post-order', 'Level-order'],
        correctAnswer: 1,
        explanation: 'In-order traversal visits (Left, Root, Right), which naturally visits smaller keys before the root and larger keys after.',
        hints: ['Think: Left < Root < Right.'],
        difficulty: 'beginner'
      }
    ],
    reteachingQuestions: [
      {
        id: 'bst-ret-1',
        type: 'mcq',
        concept: 'BST Invariant',
        question: 'Can a node in the right subtree of root 50 have a key of 45?',
        options: ['Yes, if it is a left child', 'No, all nodes in right subtree must exceed 50', 'Yes, only direct children matter'],
        correctAnswer: 1,
        explanation: 'The BST property applies to ALL nodes in the subtree, not merely direct children.',
        hints: ['The invariant is recursive across the whole subtree.'],
        difficulty: 'beginner'
      }
    ],
    flashcards: [
      {
        id: 'fc-bst-1',
        topicId: 'binary-search-trees',
        question: 'What is the worst-case time complexity of BST search if nodes are inserted in sorted order?',
        answer: 'O(n), because the tree degenerates into a single linear chain (linked list).',
        box: 1,
        nextReview: new Date().toISOString(),
        status: 'new'
      }
    ],
    commonGaps: []
  },
  'newtons-laws-of-motion': {
    id: 'newtons-laws-of-motion',
    title: "Newton's Laws of Motion",
    category: 'Physics & Classical Mechanics',
    difficulty: 'beginner',
    summary: 'Understand Inertia, Net Force, F=ma, Action-Reaction pairs, and Free Body Diagram mechanics.',
    lessons: {
      'step-by-step': {
        id: 'newton-step',
        topicId: 'newtons-laws-of-motion',
        title: "Newton's Three Fundamental Laws of Motion",
        subtitle: 'Foundations of dynamics and vector forces',
        teachingApproach: 'Step-by-Step Explanation',
        introduction: "Sir Isaac Newton's laws of motion laid the groundwork for classical mechanics, describing how objects interact through forces.",
        explanation: `### Law 1: The Law of Inertia
An object at rest stays at rest, and an object in motion continues with constant velocity along a straight line, unless acted upon by a non-zero net external force:
$$\\Sigma \\vec{F} = 0 \\implies \\vec{a} = 0$$

### Law 2: Net Force & Acceleration
The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass:
$$\\vec{F}_{net} = m \\vec{a}$$

### Law 3: Action & Reaction
When body A exerts a force on body B, body B simultaneously exerts an equal and opposite force on body A:
$$\\vec{F}_{A \\rightarrow B} = -\\vec{F}_{B \\rightarrow A}$$
*Critical rule:* Action and reaction forces act on **different** bodies, so they never cancel each other out on a single free body diagram!`,
        keyTakeaways: [
          'Inertia is the natural tendency of an object to resist changes in its state of motion.',
          'F=ma uses net vector sum of all forces, not individual isolated forces.',
          'Action-reaction pairs always act on two distinct objects.'
        ],
        visualDiagram: {
          type: 'ascii',
          title: 'Free Body Diagram of a Box on a Table',
          caption: 'Vector forces balancing on a stationary object.',
          diagram: `        ▲  Normal Force (F_N)
        │
   ┌────┴────┐
   │   BOX   │
   └────┬────┘
        │
        ▼  Gravitational Force (W = mg)`
        },
        examples: [
          {
            title: 'Calculating Acceleration on a Frictionless Surface',
            walkthrough: 'Identify net force -> apply a = F/m.',
            codeSnippet: `Mass m = 5 kg
Applied Horizontal Force F = 20 N
Net Force = 20 N
Acceleration a = F / m = 20 / 5 = 4.0 m/s^2`,
            explanation: 'Since vertical forces (Normal force and Gravity) balance, only the horizontal force drives acceleration.'
          }
        ]
      }
    },
    questions: [
      {
        id: 'newt-q1',
        type: 'mcq',
        concept: 'Action-Reaction Pairs',
        question: 'Why do Newton’s 3rd Law action and reaction forces not cancel each other out?',
        options: [
          'Because one force is always stronger than the other',
          'Because they act on two different objects',
          'Because they happen at different times',
          'Because friction absorbs the reaction force'
        ],
        correctAnswer: 1,
        explanation: 'Action and reaction act on two separate bodies (e.g., Earth pulling you down, you pulling Earth up), so they cannot cancel on a single free body diagram.',
        hints: ['Consider which object experiences each force.'],
        difficulty: 'beginner'
      }
    ],
    reteachingQuestions: [],
    flashcards: [],
    commonGaps: []
  }
};
