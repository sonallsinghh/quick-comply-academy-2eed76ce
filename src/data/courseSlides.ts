
export interface Slide {
  id: string;
  title: string;
  content: string;
  completed: boolean;
}

export interface CourseSlides {
  [key: string]: Slide[];
}

export const coursesSlides: CourseSlides = {
  "1": [
    {
      id: "slide1",
      title: "Introduction to Data Privacy",
      content: "This course will cover the essential aspects of data privacy regulations including GDPR, CCPA, and industry best practices.",
      completed: false
    },
    {
      id: "slide2",
      title: "Key GDPR Requirements",
      content: "The General Data Protection Regulation (GDPR) is a comprehensive privacy law that protects EU citizens. Learn about its key requirements and how they affect your organization.",
      completed: false
    },
    {
      id: "slide3",
      title: "CCPA Compliance",
      content: "The California Consumer Privacy Act (CCPA) gives California residents specific rights regarding their personal information. This section explains what businesses need to do for compliance.",
      completed: false
    },
    {
      id: "slide4",
      title: "Data Subject Rights",
      content: "Under modern privacy laws, individuals have specific rights over their data. Learn how to handle data access, deletion, and portability requests.",
      completed: false
    },
    {
      id: "slide5",
      title: "Breach Notification Requirements",
      content: "In case of a data breach, there are specific notification requirements that organizations must follow. This section covers the timeframes and procedures for notification.",
      completed: false
    }
  ],
  "2": [
    {
      id: "slide1",
      title: "Why Information Security Matters",
      content: "Information security is critical for protecting your organization's data, reputation, and customer trust. This section explains the importance of security practices.",
      completed: false
    },
    {
      id: "slide2",
      title: "Password Best Practices",
      content: "Strong passwords are your first line of defense. Learn how to create and manage secure passwords to protect your accounts and sensitive information.",
      completed: false
    },
    {
      id: "slide3",
      title: "Recognizing Phishing Attempts",
      content: "Phishing is one of the most common attack vectors. This section teaches you how to identify and avoid falling victim to phishing attempts.",
      completed: false
    }
  ],
  "3": [
    {
      id: "slide1",
      title: "Understanding Harassment",
      content: "Workplace harassment can take many forms. This section defines what constitutes harassment and the impact it has on individuals and the workplace.",
      completed: false
    },
    {
      id: "slide2",
      title: "Types of Harassment",
      content: "Harassment can be verbal, physical, or visual. Learn about the different types of harassment that can occur in the workplace.",
      completed: false
    },
    {
      id: "slide3",
      title: "Preventing Harassment",
      content: "Prevention is key to maintaining a respectful workplace. This section covers strategies for preventing harassment before it occurs.",
      completed: false
    }
  ],
};
