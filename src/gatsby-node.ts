import type { GatsbyNode as _GatsbyNode } from 'gatsby';

type NormalizeGatsbyNodeAPI<T extends keyof _GatsbyNode> = (
  NonNullable<_GatsbyNode[T]> extends ((...args: infer Args) => any)
  ? ((...args: Args) => (void | Promise<void>))
  : never
);

type GatsbyNode = {
  pluginOptionsSchema: NonNullable<_GatsbyNode['pluginOptionsSchema']>,
  createSchemaCustomization: NormalizeGatsbyNodeAPI<'createSchemaCustomization'>,
  sourceNodes: NormalizeGatsbyNodeAPI<'sourceNodes'>,
};

export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] = ({
  actions,
}) => {
  const gql = String.raw;

  actions.createTypes(gql`
    enum LokaliseLanguagePluralForms {
      ZERO
      ONE
      TWO
      FEW
      MANY
      OTHER
    }

    type LokaliseLanguage implements Node {
      id: ID!
      # A unique language identifier in the system.
      languageId: String!
      # Language name.
      name: String!
      # Language/locale code.
      code: String!
      # Whether the language is Right-To-Left.
      isRtl: Boolean!
      # List of supported plural forms.
      pluralForms: [LokaliseLanguagePluralForms!]!
    }

    type LokaliseProject implements Node {
      id: ID!
      # A unique project identifier in the system.
      projectId: String!
      # Project name.
      name: String!
      # Description of the project.
      description: String!
      # Date of project creation.
      createdAt: Date!
      # A default language/locale of the project.
      baseLanguage: [LokaliseLanguage!]!
      # Containing keys.
      keys: [LokaliseKey!]!
    }

    enum LokaliseSupportedPlatform {
      IOS
      ANDROID
      WEB
      OTHER
    }

    type LokaliseKey implements Node {
      id: ID!
      # A unique key identifier in the system.
      keyId: String!

      keyName(platform: LokaliseSupportedPlatform!): String!
      # Description of the key.
      description: String!
      # Creation date of the key.
      createdAt: Date!
      # Date of the latest key update (including screenshots and comments).
      modifiedAt: Date!
      # Date of the latest key translation update.
      translationModifiedAt: Date!
      # The project.
      project: Project!
      # Contaning translations.
      translations: [LokaliseTranslation!]!
      # List of platforms, enabled for this key.
      platforms: [LokaliseSupportedPlatform!]!
      # List of tags for this key.
      tags: [String!]!
    }

    type LokaliseTranslation implements Node {
      id: ID!
      # A unique key identifier in the system.
      translationId: String!
      # Date and time of last translation modification.
      modifiedAt: Date!
      # The key.
      key: LokaliseKey!
      # The project.
      project: Project!
      # The language.
      language: LokaliseLanguage!
      # Number of words in the translation.
      words: Int!
    }
  `);
};
