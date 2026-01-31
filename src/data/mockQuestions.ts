import { Question } from '../../types';

const MOCK_DATA_TEMPLATES: Record<string, Question[]> = {
  "python_logic": [
    { id: "p1", topic: "python_logic", text: "What is the output of `print([x for x in range(5) if x % 2 == 0])`?", options: ["[0, 1, 2, 3, 4]", "[0, 2, 4]", "[1, 3]", "[2, 4]"], correctAnswer: 1, explanation: "List comprehension filters for even numbers (0, 2, 4) from the range 0-4." },
    { id: "p2", topic: "python_logic", text: "Which keyword is used to handle exceptions in Python?", options: ["try...except", "do...catch", "try...catch", "errors...handle"], correctAnswer: 0, explanation: "Python uses `try` and `except` blocks for error handling." },
    { id: "p3", topic: "python_logic", text: "What does the `GIL` stand for in Python?", options: ["Global Interface Lock", "Global Interpreter Lock", "General Instruction List", "Graphical Interface Layout"], correctAnswer: 1, explanation: "The Global Interpreter Lock allows only one thread to execute Python bytecode at a time." }
  ],
  "sql_syntax": [
    { id: "s1", topic: "sql_syntax", text: "Which SQL clause is used to filter records?", options: ["GROUP BY", "ORDER BY", "WHERE", "SELECT"], correctAnswer: 2, explanation: "The WHERE clause is used to extract only those records that fulfill a specified condition." },
    { id: "s2", topic: "sql_syntax", text: "What is the result of a LEFT JOIN?", options: ["Returns all records from the left table, and the matched records from the right table", "Returns all records from both tables", "Returns only matched records", "Returns all records from right table"], correctAnswer: 0, explanation: "LEFT JOIN returns all rows from the left table and matching rows from the right table." },
    { id: "s3", topic: "sql_syntax", text: "Which function calculates the average value of a numeric column?", options: ["SUM()", "COUNT()", "AVG()", "MEAN()"], correctAnswer: 2, explanation: "AVG() returns the average value of a numeric column." }
  ],
  "model_news": [
    { id: "m1", topic: "model_news", text: "Which model introduced the 'CoT' (Chain of Thought) prompting concept popularly?", options: ["GPT-2", "PaLM", "Wei et al. (Google Research)", "BERT"], correctAnswer: 2, explanation: "Chain of Thought prompting was significantly popularized by Wei et al. in their paper on PaLM." },
    { id: "m2", topic: "model_news", text: "What is the primary feature of Gemini 1.5 Pro?", options: ["1M+ Token Context Window", "Image generation only", "Audio processing only", "Smaller parameter size"], correctAnswer: 0, explanation: "Gemini 1.5 Pro is known for its massive context window, capable of processing up to 1M (and now 2M) tokens." }
  ],
  "nocode": [
    { id: "n1", topic: "nocode", text: "In n8n, what is a 'Workflow' composed of?", options: ["Scripts", "Nodes and Connections", "Pages", "Compilers"], correctAnswer: 1, explanation: "n8n workflows are built by connecting nodes together." },
    { id: "n2", topic: "nocode", text: "Which tool is known as 'Integromat' previously?", options: ["Make.com", "Zapier", "n8n", "Retool"], correctAnswer: 0, explanation: "Make.com was formerly known as Integromat." }
  ],
  "prompt_eng": [
    { id: "pe1", topic: "prompt_eng", text: "What is 'Few-Shot Prompting'?", options: ["Providing no examples", "Providing 2-5 examples of input-output pairs", "Writing a very short prompt", "Asking the model to shoot for the stars"], correctAnswer: 1, explanation: "Few-shot prompting involves providing a few examples to guide the model's behavior." },
    { id: "pe2", topic: "prompt_eng", text: "What does 'temperature' control in LLM generation?", options: ["Speed of generation", "Randomness/Creativity", "Context length", "Model size"], correctAnswer: 1, explanation: "Higher temperature increases randomness; lower temperature makes output more deterministic." }
  ],
  "agentic_ai": [
    { id: "aa1", topic: "agentic_ai", text: "What is the core concept of an 'Agent'?", options: ["A simple chatbot", "A system that can use tools and plan to achieve a goal", "A database wrapper", "A vector store"], correctAnswer: 1, explanation: "Agents are defined by their ability to reason, plan, and use tools to solve complex tasks." },
    { id: "aa2", topic: "agentic_ai", text: "What library is commonly used for building agents in Python?", options: ["React", "LangChain", "Bootstrap", "jQuery"], correctAnswer: 1, explanation: "LangChain is a popular framework for developing applications powered by language models, including agents." }
  ],
  "cloud": [
    { id: "c1", topic: "cloud", text: "What is AWS Bedrock?", options: ["A geology app", "A foundational model service", "A storage service", "A new OS"], correctAnswer: 1, explanation: "AWS Bedrock is a fully managed service that makes foundation models available via an API." },
    { id: "c2", topic: "cloud", text: "Which service belongs to Azure for AI?", options: ["Azure AI Studio", "SageMaker", "Vertex AI", "Watson"], correctAnswer: 0, explanation: "Azure AI Studio is Microsoft's platform for building generative AI applications." }
  ],
  "architecture": [
    { id: "ar1", topic: "architecture", text: "What is 'Microservices' architecture?", options: ["One large application", "Structuring an app as a collection of loosely coupled services", "Using only microchips", "Writing small code"], correctAnswer: 1, explanation: "Microservices architecture structures an application as a collection of services that are highly maintainable and testable." },
    { id: "ar2", topic: "architecture", text: "What does REST stand for?", options: ["Representational State Transfer", "Real State Transfer", "Really Easy Simple Test", "Random Event State Transfer"], correctAnswer: 0, explanation: "REST stands for Representational State Transfer." }
  ],
  "api_mastery": [
    { id: "am1", topic: "api_mastery", text: "Which HTTP method is typically used to create a resource?", options: ["GET", "POST", "PUT", "DELETE"], correctAnswer: 1, explanation: "POST is generally used to create new resources." },
    { id: "am2", topic: "api_mastery", text: "What is a 401 error?", options: ["Not Found", "Bad Request", "Unauthorized", "Server Error"], correctAnswer: 2, explanation: "401 indicates that the request lacks valid authentication credentials." }
  ],
  "case_study": [
    { id: "cs1", topic: "case_study", text: "When analyzing an AI rollout, what is a key metric?", options: ["Lines of code", "User Adoption Rate", "Server color", "Keyboard type"], correctAnswer: 1, explanation: "Adoption rate is critical to determining the success of a rollout." },
    { id: "cs2", topic: "case_study", text: "Why do many AI projects fail?", options: ["Bad wifi", "Lack of clear business use case", "Too much money", "Computers are too fast"], correctAnswer: 1, explanation: "A lack of a defined problem or business value is a common failure point." }
  ],
  "debugging": [
    { id: "d1", topic: "debugging", text: "What is a 'stack trace'?", options: ["A pile of pancakes", "A report of the active stack frames at a certain point in execution", "A memory leak", "A database query"], correctAnswer: 1, explanation: "A stack trace helps debugging by showing the function call history leading to an error." },
    { id: "d2", topic: "debugging", text: "What is 'Rubber Duck Debugging'?", options: ["Debugging with a toy", "Explaining code line-by-line to an inanimate object", "Taking a bath", "Programming in water"], correctAnswer: 1, explanation: "Explaining the code helps the programmer clarify their thoughts and find the bug." }
  ],
  "database_rag": [
     { id: "dr1", topic: "database_rag", text: "What is a Vector Database optimized for?", options: ["Storing images directly", "Storing and querying high-dimensional vector embeddings", "Storing SQL tables", "Storing cache"], correctAnswer: 1, explanation: "Vector databases are designed to handle vector embeddings efficiently for similarity search." },
     { id: "dr2", topic: "database_rag", text: "What does RAG stand for?", options: ["Red Apple Green", "Retrieval-Augmented Generation", "Random Access Generation", "Real Artificial Gen"], correctAnswer: 1, explanation: "RAG combines retrieval of documents with generative models." }
  ],
  "ethics": [
    { id: "e1", topic: "ethics", text: "What is 'Hallucination' in AI?", options: ["AI dreaming", "Confident but incorrect generation", "Visual effects", "Audio noise"], correctAnswer: 1, explanation: "Hallucination refers to the model generating factually incorrect information effectively." },
    { id: "e2", topic: "ethics", text: "What is GDPR?", options: ["General Data Protection Regulation", "Global Data Privacy Rule", "Good Data Practice Rule", "General Digital Public Registry"], correctAnswer: 0, explanation: "GDPR is a regulation in EU law on data protection and privacy." }
  ],
  "ui": [
    { id: "u1", topic: "ui", text: "What is 'Tailwind CSS'?", options: ["A component library", "A utility-first CSS framework", "A JavaScript framework", "A database"], correctAnswer: 1, explanation: "Tailwind CSS provides low-level utility classes to build designs directly in markup." },
    { id: "u2", topic: "ui", text: "What hook handles side effects in React?", options: ["useState", "useEffect", "useContext", "useReducer"], correctAnswer: 1, explanation: "useEffect is used for performing side effects in function components." }
  ],
  "roi": [
    { id: "r1", topic: "roi", text: "What does ROI stand for?", options: ["Rate of Interest", "Return on Investment", "Risk on Internet", "Real Old Income"], correctAnswer: 1, explanation: "Return on Investment measures the gain or loss generated on an investment." },
    { id: "r2", topic: "roi", text: "Which factor improves AI ROI?", options: ["Higher token costs", "Automation of high-volume repetitive tasks", "Buying more monitors", "Slower computers"], correctAnswer: 1, explanation: "Automating repetitive tasks significantly increases efficiency and ROI." }
  ],
  "soft_skills": [
    { id: "ss1", topic: "soft_skills", text: "When explaining technical concepts to non-tech stakeholders, you should:", options: ["Use as much jargon as possible", "Focus on business value and analogies", "Show raw code", "Speak very fast"], correctAnswer: 1, explanation: "Focusing on value and using simple analogies helps bridge the communication gap." },
    { id: "ss2", topic: "soft_skills", text: "What is 'Active Listening'?", options: ["Listening while running", "Fully concentrating, understanding, and responding to the speaker", "Interrupting frequently", "Sleeping"], correctAnswer: 1, explanation: "Active listening involves full engagement with the speaker." }
  ],
  "reflection": [
    { id: "rf1", topic: "reflection", text: "Why is daily reflection important?", options: ["It wastes time", "It consolidates learning and highlights areas for improvement", "It makes you sleepy", "It is required by law"], correctAnswer: 1, explanation: "Reflection helps move information from short-term to long-term memory." },
    { id: "rf2", topic: "reflection", text: "What is a 'Learning Log'?", options: ["A heavy piece of wood", "A record of what you learned, challenges faced, and solutions found", "A login screen", "A textbook"], correctAnswer: 1, explanation: "Keeping a learning log tracks progress and creates a personal knowledge base." }
  ]
};

export const getMockQuestions = (topicId: string, topicTitle: string): Question[] => {
  const realQuestions = MOCK_DATA_TEMPLATES[topicId] || [];
  const totalNeeded = 100;
  const mockQuestions: Question[] = [];

  // Cycle through real questions to fill up to 100
  // This ensures high quality (real text) while meeting the quantity requirement
  for (let i = realQuestions.length; i < totalNeeded; i++) {
    const sourceQuestion = realQuestions[i % realQuestions.length];
    const mockId = `${topicId}-gen-${i}`;
    
    // We clone the real question but give it a unique ID so React handles it correctly
    mockQuestions.push({
      ...sourceQuestion,
      id: mockId
    });
  }

  // Combine real and mock
  const combined = [...realQuestions, ...mockQuestions];
  return combined.sort(() => 0.5 - Math.random()); // Shuffle so duplicates aren't adjacent
};
