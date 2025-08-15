/**
 * Simple filter functions for professional filtering
 */

import mongoose from 'mongoose';

/**
 * Build query for MongoDB with simple filters
 * @param {string} userId - Current user ID
 * @param {string} searchQuery - Search query for name or keywords
 * @param {string} filterBy - Profession type filter
 * @returns {Object} - MongoDB query object
 */
export function buildSimpleQuery(userId, searchQuery, filterBy) {
  const query = {
    userId: { $ne: new mongoose.Types.ObjectId(userId) }
  };
  
  // Apply profession type filter
  if (filterBy && filterBy !== 'all') {
    query.professionType = filterBy;
  }
  
  // We'll handle the user name search after population
  if (searchQuery) {
    query.$or = [
      // Search in professional details
      { professionType: { $regex: searchQuery, $options: 'i' } },
      { 'profileSummary.bio': { $regex: searchQuery, $options: 'i' } },
      { 'profileSummary.headline': { $regex: searchQuery, $options: 'i' } },
      
      // Search in skills
      { 'skills.name': { $regex: searchQuery, $options: 'i' } }
    ];
  }
  
  return query;
}

/**
 * Sort professionals based on sort criteria
 * @param {Array} professionals - Array of professional objects
 * @param {string} sortBy - Sort criteria
 * @returns {Array} - Sorted professionals
 */
export function sortProfessionals(professionals, sortBy) {
  switch (sortBy) {
    case 'name':
      return [...professionals].sort((a, b) => {
        const nameA = a.userId?.name || '';
        const nameB = b.userId?.name || '';
        return nameA.localeCompare(nameB);
      });
      
    case 'experience':
      return [...professionals].sort((a, b) => {
        const expA = calculateExperienceYears(a.experience || []);
        const expB = calculateExperienceYears(b.experience || []);
        return expB - expA; // Sort by most experience first
      });
      
    case 'recent':
      return [...professionals].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB - dateA; // Sort by most recent first
      });
      
    default:
      return professionals;
  }
}

/**
 * Calculate years of experience
 * @param {Array} experiences - Array of experience objects
 * @returns {number} - Total years of experience
 */
function calculateExperienceYears(experiences) {
  if (!experiences || !Array.isArray(experiences) || experiences.length === 0) return 0;
  
  return experiences.reduce((total, exp) => {
    if (!exp?.startDate) return total;
    const start = new Date(exp.startDate);
    const end = exp?.endDate ? new Date(exp.endDate) : new Date();
    return total + Math.max(0, (end.getFullYear() - start.getFullYear()));
  }, 0);
}