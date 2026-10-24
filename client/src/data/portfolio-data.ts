import type { Profile, Skill, ProcessStep, Project, SocialLink, ResumeEntry, Experience, Education, Course } from "@shared/schema";

export const profile: Profile = {
  name: "Billy Nguyen",
  title: "Software Engineer",
  bio: "",
  email: "bnvinh0808@gmail.com",
};

export const aboutMe = {
  paragraphs: [
    `Growing up in the agricultural heart of the Central Valley, my early environment was defined by farming rather than technology. My journey into computer science began unexpectedly in high school. I wanted to help small, immigrant-owned businesses in my community generate much-needed publicity, so I taught myself how to build websites. What started as a simple desire to support local entrepreneurs, along with my interests in GPUs for gaming, all together snowballed into a fascination with modern technology.`,

    `Before college even began, I fell completely down the programming rabbit hole. I found myself drawn away from basic web development and pulled toward highly complex, ambiguous projects that required rigorous, creative problem-solving. This intense drive ultimately led me to pursue my degree in Computer Science at UC Berkeley, where I could fully explore the theoretical and practical foundations of computation.`,

    `Today, my primary passion lies directly at the intersection of mathematics and systems, specifically within the realm of machine learning. I am captivated by the unique challenge of designing robust machine learning systems, maintaining a strong technical focus on distributed inference optimization, high-performance software systems, and scalable solutions for the future of global technical infrastructure.`,

    `I am driven by the same curiosity that originally sparked my first high school web project. I thrive in dynamic environments where math and efficient code converge to solve intricate challenges, so if there's an oppurtunity that you'd like me to hear about, please feel free to reach out!.`,
  ],
  images: [
    "/assets/about-me/IMG_8270.JPG",
    "/assets/about-me/IMG_7306.JPG",
    "/assets/about-me/1c523ddd-0621-4e5d-932d-2a188670fb67.JPG",
  ],
};

// Synced from https://www.linkedin.com/in/billyvn/
export const experiences: Experience[] = [
  {
    id: "exp-1",
    title: "AI/ML Engineer Intern",
    company: "Wells Fargo",
    date: "May 2026 – Aug 2026",
    logoUrl: "/assets/logos/wells-fargo.png",
    domain: "wellsfargo.com",
  },
  {
    id: "exp-2",
    title: "Web Developer",
    company: "UC Berkeley, Rausser College of Natural Resources",
    date: "Aug 2025 – Dec 2025",
    logoUrl: "/assets/logos/berkeley.png",
    domain: "berkeley.edu",
  },
  {
    id: "exp-3",
    title: "Full Stack Developer Intern",
    company: "Ki",
    date: "May 2025 – Sep 2025",
    logoUrl: "/assets/logos/ki.png",
    domain: "kidrone.org",
  },
  {
    id: "exp-4",
    title: "Undergraduate Research Assistant",
    company: "University of California, Berkeley",
    date: "Jan 2024 – May 2024",
    logoUrl: "/assets/logos/berkeley.png",
    domain: "berkeley.edu",
  },
  {
    id: "exp-5",
    title: "Undergraduate Student Researcher",
    company: "UC Berkeley College of Computing, Data Science, and Society",
    date: "Jan 2024 – May 2024",
    logoUrl: "/assets/logos/berkeley.png",
    domain: "berkeley.edu",
  },
];

// Synced from https://www.linkedin.com/in/billyvn/
export const education: Education[] = [
  {
    id: "edu-1",
    school: "University of California, Berkeley",
    degree: "B.A. Computer Science & Statistics",
    date: "2024–2028",
    gpa: "3.9/4.0",
    activities: [
      "Student Association for Applied Statistics (SAAS) - Machine Learning & Data Science consultant @ UC Berkeley",
      "Computer Science Undergraduate Association — Previous External",
      "CS Scholars - 61A & 61B", 
      "Poker @ Berkeley",

      // "Traders at Berkeley — Head of Game Development, 2026 Berkeley Trading Competition",
      // "Student Association for Applied Statistics — Project Manager",
    ],
    logoUrl: "/assets/logos/berkeley.png",
    domain: "berkeley.edu",
  },
];

// Official course sites, checked October 2026. Math links use the department's
// course pages because the particular instructor/semester isn't specified.
export const relevantCoursework: Course[] = [
  { code: "CS 161", name: "Computer Security", url: "https://cs161.org/" },
  { code: "CS 162", name: "Operating Systems", url: "https://cs162.org/" },
  { code: "CS 168", name: "Internet Architecture", url: "https://fa26.cs168.io/" },
  { code: "CS 152", name: "Computer Architecture & Engineering", url: "https://cs152.org/" },
  { code: "CS 170", name: "Efficient Algorithms", url: "https://cs170.org/" },
  { code: "CS 182", name: "Deep Neural Networks", url: "https://berkeley-cs182.github.io/" },
  { code: "EECS 183", name: "Natural Language Processing", url: "https://cal-nlp-class.github.io/fa26/" },
  { code: "EECS 126", name: "Probability & Random Processes", url: "https://inst.eecs.berkeley.edu/~ee126/fa26/info/" },
  { code: "EECS 127", name: "Optimization Models", url: "https://eecs127.github.io/" },
  { code: "CS 70", name: "Discrete Math & Probability", url: "https://www.eecs70.org/" },
  { code: "CS 61C", name: "Machine Structures", url: "https://cs61c.org/" },
  { code: "CS 61B", name: "Data Structures", url: "https://fa26.datastructur.es/" },
  { code: "CS 61A", name: "Computer Programming", url: "https://cs61a.org/" },
  { code: "Math 56", name: "Linear Algebra", url: "https://math.berkeley.edu/node/3700" },
  { code: "Math 53", name: "Multivariable Calculus", url: "https://math.berkeley.edu/courses/overview/lowerdivcourses/math53" },
  { code: "Data 100", name: "Data Analysis & Visualization", url: "https://ds100.org/" },
  { code: "Data 8", name: "Data Science Foundations", url: "https://data8.org/" },
];

export const skills: Skill[] = [
  {
    id: "bibliography",
    category: "Bibliography",
    title: "Bibliography",
    subtitle: "My Journey",
    icon: "book",
    features: [
      "Continuous Learner",
      "Tech Enthusiast",
      "Problem Solver",
      "Cinephile",
      "Baker",
      "Gamer",
      "Gym Rat",
      "Tennis Player"
    ]
  },
  {
    id: "interests",
    category: "Interests",
    title: "Interests",
    subtitle: "What I Love",
    icon: "heart",
    features: [
        "Teaching & Mentoring",
        "Favorite Movie: Good Will Hunting",
        "Favorite Show: Arcane",
        "Favorite Game: Poker",
        "Favorite Food: Banh Bao",
        "Favorite Drink: Avocado Smoothie",
        "Favorite Sweet Treat: Frozen Yogurt"
    ]
  }
];

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Define",
    description: "Understanding the goal, target audience, and project requirements. Conduct lots of research, Create a rough outline and define success.",
    features: ["Project Planning", "User Research", "Project Scope"]
  },
  {
    number: "02",
    title: "Design",
    description: "For Projects that have interface, I design them to be intuitive and engaging. Create wireframes and finalize the design systems.",
    features: ["Wireframing", "System Design", "Prototyping"]
  },
  {
    number: "03",
    title: "Build",
    description: "Transforming designs into high-performance applications using modern technologies and best practices.",
    features: ["Frontend Development", "Backend Development", "Testing"]
  },
  {
    number: "04",
    title: "Launch",
    description: "Finally, deploy the application, monitor performance, and updated to ensure continued success.",
    features: ["Deployment", "Performance Monitoring", "Maintenance"]
  }
];

export const projects: Project[] = [
    {
        id: "project-1",
        name: "Plan A",
        description: "Convert unstructured visual inspiration (social media video/images) of travel destinations into a structured, optimized itinerary with navigation intergrated with Google Maps.",
        tags: ["Python", "FastAPI", "TypeScript", "React Native", "PostgreSQL", "Redis", "Google Map API", "OpenAI API"],
        featured: true
      },
    {
        id: "project-2",
        name: "Ki Drone (Internship)",
        description: "Engineered a cross-platform desktop application for post-wildfire reforestation. I disected shapefiles and other Geographic Information System (GIS) layers, compute flight corridors, spacing, and seed-drop points with custom geospatial algorithms, and render everything on a map for field teams can run offline.",
            tags: [ "Python","Node.JS", "JavaScript", "HTML/CSS",  "Flask", "Electron", "ArcGIS", "GeoPandas", "Numpy", "PyProj", "Shapely"],
        featured: true
        },
      {
        id: "project-3",
        name: "Nanotechnology (Research)",
        description: "Help design a Python based simulation software that displays the modeling of nanoscale biosensors and visualizing electrochemical behavior. I streamlined parameter fitting, and plot generation so researchers can compare theoretical models with experimental results effectively.",
        tags: ["Python", "StreamLit", "HTML/CSS", "NumPy", "Pandas"],
        featured: true
      },
      {
        id: "project-4",
        name: "Google Meet Translate",
        description: "Developed a a lightweight browser extension that captures live captions from Google Meet and translates them in real time using a local server API from libretranslate. Smooth subtitle rendering, and a simple controls panel so users can switch languages.",
        tags: ["HTML/CSS", "JavaScript", "Docker", "LibreTranslateAPI"],
        featured: true
      },
      {
        id: "project-5",
        name: "ABC Comfort Model",
        description: "Contributed to a web application that allows users to visualize their enviroment with various biological and environmental parameters through a thermoregulartoy physioogical model of the human body.",
        tags: ["React", "Node.js", "Next.js"],
        featured: true
      }
];

export const selfLearning: ResumeEntry[] = [];

export const socialLinks: SocialLink[] = [
  { platform: "GitHub", url: "https://github.com/BIN0806", icon: "github" },
  { platform: "LinkedIn", url: "https://www.linkedin.com/in/billyvn/", icon: "linkedin" },
  { platform: "Twitter", url: "https://x.com/02H3ro", icon: "twitter" },
  { platform: "Email", url: "mailto:bnvinh0808@gmail.com", icon: "mail" }
];

