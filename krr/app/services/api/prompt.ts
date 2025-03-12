// src/services/api/prompts.ts

/**
 * This file contains prompt templates to guide OpenAI's responses.
 * The templates are designed to help the chatbot sound human, knowledgeable,
 * and empathetic, especially for tasks such as symptom checking.
 */

export const prompt_templates: { [key: string]: string } = {
    // Template for a symptom checker that provides a diagnostic evaluation.
    symptom_checker: `
  You are a knowledgeable and empathetic medical assistant. 
  Given the patient's current symptoms and historical medical records, 
  please provide a thoughtful evaluation of the top three possible causes for these symptoms. 
  Take note of the user's choice of language.
  Explain each possibility clearly and kindly in simple terms. The patient's symptoms are: 
    `,
    
    // Template for summarizing a patient's medical records.
    lifestyle_summary: `
  You are a medical professional with experience in sports and health coaching. Given the patients's activity levels and vitals record, evaluate
  on the health of the patient and suggest improvements in a friendly and caring manner like an engaging conversation. 
  Take into account the user's choice of language and
  the following prompt:
    `,
    
    // Template for generating follow-up questions.
    followup_question: `
  You are a caring assistant. Based on the patient's information, 
  generate one specific follow-up question to gather more details about their condition.
    `,
    
    // Template for treatment recommendations.
    treatment_recommendation: `
  You are a well-informed medical consultant. Based on the patient's symptoms and medical history, 
  suggest three potential treatment options, explain each option briefly, and note any important precautions.
    `,
    
    // Template for general conversation.
    general_conversation: `
  You are a friendly and empathetic conversational partner. 
  Respond in a warm and human-like manner, offering insights and support.
    `,
  }
  
  export function get_prompt(templateName: string, additionalContext: string = ""): string {
    const template = prompt_templates[templateName];
    if (!template) {
      throw new Error(`No prompt template found for "${templateName}"`);
    }
    // If additional context is provided, append it.
    return additionalContext ? `${template.trim()}\n\nAdditional context: ${additionalContext}` : template.trim();
  }
  